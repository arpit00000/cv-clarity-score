import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentParseRequest {
  filePath: string;
  bucketName: string;
  documentId: string;
  documentType: 'job_description' | 'resume';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { filePath, bucketName, documentId, documentType }: DocumentParseRequest = await req.json();

    console.log(`Parsing document: ${filePath} from bucket: ${bucketName}`);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError);
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await fileData.arrayBuffer();
    
    // Parse the document based on file type
    let parsedText = '';
    const fileName = filePath.toLowerCase();
    
    if (fileName.endsWith('.pdf')) {
      parsedText = await parsePDF(arrayBuffer);
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      parsedText = await parseDOCX(arrayBuffer);
    } else {
      throw new Error('Unsupported file type. Only PDF and DOCX files are supported.');
    }

    console.log(`Extracted text length: ${parsedText.length} characters`);

    // Update the database with parsed text
    const tableName = documentType === 'job_description' ? 'job_descriptions' : 'resumes';
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ parsed_text: parsedText })
      .eq('id', documentId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to update database: ${updateError.message}`);
    }

    console.log(`Successfully parsed and stored text for ${documentType} ${documentId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        textLength: parsedText.length,
        preview: parsedText.substring(0, 200) + '...'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function parsePDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Use a simple text extraction approach for PDFs
    // In a production environment, you might want to use a more sophisticated PDF parser
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(arrayBuffer);
    
    // Extract readable text from PDF (basic implementation)
    // This is a simplified approach - in production, use a proper PDF parser
    const textMatch = text.match(/stream\s*(.*?)\s*endstream/gs);
    let extractedText = '';
    
    if (textMatch) {
      for (const match of textMatch) {
        const content = match.replace(/stream\s*|\s*endstream/g, '');
        // Basic text extraction - remove common PDF encoding artifacts
        const cleanText = content
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Keep only printable ASCII + whitespace
          .replace(/\s+/g, ' ')
          .trim();
        extractedText += cleanText + ' ';
      }
    }
    
    // If no text found through streams, try basic string extraction
    if (!extractedText.trim()) {
      extractedText = text
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    return extractedText || 'Could not extract text from PDF. Please ensure the PDF contains readable text.';
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    return 'Error parsing PDF file. Please try uploading a different format.';
  }
}

async function parseDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Basic DOCX parsing - in production, use a proper DOCX parser
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(arrayBuffer);
    
    // Extract text from DOCX XML content
    const xmlMatches = text.match(/<w:t[^>]*>(.*?)<\/w:t>/gs);
    let extractedText = '';
    
    if (xmlMatches) {
      for (const match of xmlMatches) {
        const content = match.replace(/<w:t[^>]*>|<\/w:t>/g, '');
        // Decode basic XML entities
        const decodedContent = content
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");
        extractedText += decodedContent + ' ';
      }
    }
    
    // Clean up the extracted text
    const cleanText = extractedText
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanText || 'Could not extract text from DOCX. Please ensure the document contains readable text.';
    
  } catch (error) {
    console.error('DOCX parsing error:', error);
    return 'Error parsing DOCX file. Please try uploading a different format.';
  }
}