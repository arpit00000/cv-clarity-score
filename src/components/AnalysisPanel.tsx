import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Brain, FileText, Users, Target } from 'lucide-react';

interface JobDescription {
  id: string;
  title: string;
  location: string;
}

interface Resume {
  id: string;
  candidate_name: string;
  location: string;
  parsed_text?: string;
}

interface Match {
  id: string;
  score: number;
  verdict: string;
  missing_skills: string[];
  feedback: string;
  resumes: Resume;
  job_descriptions: JobDescription;
}

const AnalysisPanel = () => {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobDescriptions();
    fetchResumes();
    fetchMatches();
  }, []);

  const fetchJobDescriptions = async () => {
    const { data, error } = await supabase
      .from('job_descriptions')
      .select('id, title, location')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching job descriptions:', error);
    } else {
      setJobDescriptions(data || []);
    }
  };

  const fetchResumes = async () => {
    const { data, error } = await supabase
      .from('resumes')
      .select('id, candidate_name, location, parsed_text')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching resumes:', error);
    } else {
      setResumes(data || []);
    }
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        score,
        verdict,
        missing_skills,
        feedback,
        resumes(id, candidate_name, location),
        job_descriptions(id, title, location)
      `)
      .order('score', { ascending: false });
    
    if (error) {
      console.error('Error fetching matches:', error);
    } else {
      setMatches(data || []);
    }
  };

  const handleBulkAnalyze = async () => {
    if (!selectedJobId) return;
    
    const parsedResumes = resumes.filter(r => r.parsed_text && r.parsed_text !== 'File uploaded - parsing pending');
    setIsAnalyzing(true);
    
    for (const resume of parsedResumes) {
      try {
        await supabase.functions.invoke('analyze-resume', {
          body: { jobId: selectedJobId, resumeId: resume.id }
        });
      } catch (error) {
        console.error(`Failed to analyze resume ${resume.id}:`, error);
      }
    }
    
    setIsAnalyzing(false);
    fetchMatches();
    toast({
      title: "Bulk analysis complete",
      description: `Analyzed ${parsedResumes.length} resumes`,
    });
  };

  const handleAnalyze = async (resumeId: string) => {
    if (!selectedJobId) {
      toast({
        title: "No job selected",
        description: "Please select a job description first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log(`Starting AI analysis for resume ${resumeId} against job ${selectedJobId}`);
      
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          jobId: selectedJobId,
          resumeId: resumeId
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw new Error(error.message || 'Analysis failed');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Analysis failed');
      }

      console.log('Analysis completed successfully:', data.result);

      toast({
        title: "Analysis complete!",
        description: `Resume analyzed successfully. Score: ${data.result.score}%`,
        variant: "default"
      });

      // Refresh the matches to show the new analysis
      fetchMatches();
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = 'Failed to analyze resume. ';
      if (error instanceof Error) {
        if (error.message.includes('parsed_text')) {
          errorMessage += 'Make sure both the job description and resume have been successfully parsed.';
        } else if (error.message.includes('OpenAI')) {
          errorMessage += 'AI service is temporarily unavailable. Please try again later.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Please try again.';
      }
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Analysis Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Job Description</label>
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a job description" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobDescriptions.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} {job.location && `- ${job.location}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedJobId && resumes.length > 0 && (
                <div className="border-t pt-4">
                  <Button
                    onClick={handleBulkAnalyze}
                    disabled={isAnalyzing || !selectedJobId}
                    variant="secondary"
                    className="w-full"
                  >
                    {isAnalyzing ? 'Analyzing...' : `Analyze All Resumes (${resumes.filter(r => r.parsed_text && r.parsed_text !== 'File uploaded - parsing pending').length})`}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Bulk analyze all parsed resumes against selected job
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{jobDescriptions.length}</div>
                <div className="text-sm text-muted-foreground">Job Descriptions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{resumes.length}</div>
                <div className="text-sm text-muted-foreground">Resumes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{matches.length}</div>
                <div className="text-sm text-muted-foreground">Analyses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Parse Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes.map((resume) => {
                const isParsed = resume.parsed_text && resume.parsed_text !== 'File uploaded - parsing pending';
                return (
                  <TableRow key={resume.id}>
                    <TableCell className="font-medium">{resume.candidate_name}</TableCell>
                    <TableCell>{resume.location || 'Not specified'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isParsed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm">{isParsed ? 'Parsed' : 'Parsing...'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleAnalyze(resume.id)}
                        disabled={isAnalyzing || !selectedJobId || !isParsed}
                        title={!isParsed ? 'Document must be parsed before analysis' : ''}
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Missing Skills</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="font-medium">{match.resumes.candidate_name}</TableCell>
                  <TableCell>{match.job_descriptions.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getScoreColor(match.score)}`}></div>
                      {match.score}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getVerdictColor(match.verdict)}>
                      {match.verdict}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {match.missing_skills?.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={match.feedback}>
                    {match.feedback}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisPanel;