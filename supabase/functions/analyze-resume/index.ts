import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  jobId: string;
  resumeId: string;
}

interface AnalysisResult {
  score: number;
  verdict: 'High' | 'Medium' | 'Low';
  missing_skills: string[];
  feedback: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { jobId, resumeId }: AnalysisRequest = await req.json();

    console.log(`Analyzing resume ${resumeId} against job ${jobId}`);

    // Fetch job description and resume data
    const [jobResponse, resumeResponse] = await Promise.all([
      supabase
        .from('job_descriptions')
        .select('title, location, parsed_text')
        .eq('id', jobId)
        .single(),
      supabase
        .from('resumes')
        .select('candidate_name, location, parsed_text')
        .eq('id', resumeId)
        .single()
    ]);

    if (jobResponse.error || !jobResponse.data) {
      throw new Error(`Job description not found: ${jobResponse.error?.message}`);
    }

    if (resumeResponse.error || !resumeResponse.data) {
      throw new Error(`Resume not found: ${resumeResponse.error?.message}`);
    }

    const jobData = jobResponse.data;
    const resumeData = resumeResponse.data;

    console.log(`Job: ${jobData.title}, Candidate: ${resumeData.candidate_name}`);

    // Check if parsed text exists
    if (!jobData.parsed_text?.trim()) {
      throw new Error('Job description text not available. Please ensure the document was parsed successfully.');
    }

    if (!resumeData.parsed_text?.trim()) {
      throw new Error('Resume text not available. Please ensure the document was parsed successfully.');
    }

    // Perform AI analysis using OpenAI
    const analysisResult = await performAIAnalysis(
      openAIApiKey,
      jobData,
      resumeData
    );

    console.log(`Analysis complete. Score: ${analysisResult.score}%, Verdict: ${analysisResult.verdict}`);

    // Store the analysis result in the database
    const { error: insertError } = await supabase
      .from('matches')
      .insert({
        job_id: jobId,
        resume_id: resumeId,
        score: analysisResult.score,
        verdict: analysisResult.verdict,
        missing_skills: analysisResult.missing_skills,
        feedback: analysisResult.feedback
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to store analysis: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: analysisResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function performAIAnalysis(
  apiKey: string,
  jobData: any,
  resumeData: any
): Promise<AnalysisResult> {
  const prompt = `You are an expert recruitment analyst. Analyze how well this candidate's resume matches the job requirements.

JOB DESCRIPTION:
Title: ${jobData.title}
Location: ${jobData.location || 'Not specified'}
Requirements and Description:
${jobData.parsed_text}

CANDIDATE RESUME:
Name: ${resumeData.candidate_name}
Location: ${resumeData.location || 'Not specified'}
Resume Content:
${resumeData.parsed_text}

Please provide a comprehensive analysis in the following JSON format:
{
  "score": <integer between 0-100>,
  "verdict": "<High|Medium|Low>",
  "missing_skills": ["skill1", "skill2", ...],
  "feedback": "<detailed feedback paragraph>"
}

Scoring Guidelines:
- 80-100: High match - Excellent fit with most requirements met
- 60-79: Medium match - Good fit with some gaps
- 0-59: Low match - Significant gaps in requirements

Focus on:
1. Technical skills alignment
2. Experience level match
3. Industry experience
4. Educational background
5. Location compatibility
6. Soft skills and cultural fit indicators

Provide specific, actionable feedback and identify the top 3-5 missing skills if any.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert recruitment analyst. Always respond with valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Parse the JSON response
    let analysisResult: AnalysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw AI response:', aiResponse);
      
      // Fallback analysis if JSON parsing fails
      analysisResult = {
        score: 50,
        verdict: 'Medium',
        missing_skills: ['Unable to determine specific skills'],
        feedback: 'Analysis completed but detailed breakdown is not available. The AI response could not be parsed properly.'
      };
    }

    // Validate and sanitize the analysis result
    analysisResult.score = Math.max(0, Math.min(100, analysisResult.score || 50));
    
    if (!['High', 'Medium', 'Low'].includes(analysisResult.verdict)) {
      analysisResult.verdict = analysisResult.score >= 80 ? 'High' : 
                              analysisResult.score >= 60 ? 'Medium' : 'Low';
    }

    if (!Array.isArray(analysisResult.missing_skills)) {
      analysisResult.missing_skills = [];
    }

    if (!analysisResult.feedback || typeof analysisResult.feedback !== 'string') {
      analysisResult.feedback = `Candidate scored ${analysisResult.score}% match for this position.`;
    }

    return analysisResult;

  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Return a fallback analysis in case of AI service failure
    return {
      score: 50,
      verdict: 'Medium',
      missing_skills: ['Analysis service temporarily unavailable'],
      feedback: `Unable to complete detailed AI analysis due to service error: ${error.message}. Please try again later.`
    };
  }
}