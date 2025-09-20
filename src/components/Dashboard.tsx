import { useState } from 'react';
import { Upload, FileText, Users, BarChart3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CandidateResult {
  id: string;
  name: string;
  email: string;
  score: number;
  verdict: 'high' | 'medium' | 'low';
  missingSkills: string[];
  feedback: string;
  resumeFile: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const mockResults: CandidateResult[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      score: 85,
      verdict: 'high',
      missingSkills: ['React Native'],
      feedback: 'Strong technical background with excellent problem-solving skills. Perfect fit for senior role.',
      resumeFile: 'sarah_johnson_resume.pdf'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      score: 72,
      verdict: 'medium',
      missingSkills: ['AWS', 'Docker'],
      feedback: 'Good foundation but needs cloud infrastructure experience.',
      resumeFile: 'mike_chen_resume.pdf'
    },
    {
      id: '3',
      name: 'Alex Rivera',
      email: 'alex.rivera@email.com',
      score: 45,
      verdict: 'low',
      missingSkills: ['React', 'TypeScript', 'Node.js'],
      feedback: 'Entry-level candidate. Significant skills gap for this position.',
      resumeFile: 'alex_rivera_resume.pdf'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const filteredResults = mockResults.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">ResumeMatch Pro</h1>
              <p className="text-muted-foreground">AI-Powered Recruitment Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" className="px-3 py-1">
                <BarChart3 className="w-3 h-3 mr-1" />
                3 Active Jobs
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Users className="w-3 h-3 mr-1" />
                12 Candidates
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Job Description Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Job Description
                  </CardTitle>
                  <CardDescription>
                    Upload the job description to match against resumes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drop your job description here or click to browse
                    </p>
                    <Button variant="secondary" className="mt-4">
                      Choose File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resumes Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Candidate Resumes
                  </CardTitle>
                  <CardDescription>
                    Upload multiple resumes for batch analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drop resume files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, DOC, DOCX files
                    </p>
                    <Button variant="secondary" className="mt-4">
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center">
                  <Button variant="hero" size="lg" className="px-8">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Analyze Matches
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Candidate Results</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredResults.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          <Badge variant={candidate.verdict}>
                            {candidate.verdict.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{candidate.email}</p>
                        <p className="text-sm">{candidate.feedback}</p>
                        {candidate.missingSkills.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Missing Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.missingSkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        <div className={`text-3xl font-bold ${getScoreColor(candidate.score)}`}>
                          {candidate.score}
                        </div>
                        <p className="text-xs text-muted-foreground">Match Score</p>
                        <Button variant="outline" size="sm">
                          View Resume
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+3 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">High Match Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">33%</div>
                  <p className="text-xs text-muted-foreground">4 out of 12 candidates</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67</div>
                  <p className="text-xs text-muted-foreground">+5 points this week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>Most commonly missing skills across candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['React Native', 'AWS', 'Docker', 'TypeScript', 'Node.js'].map((skill, index) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${100 - (index + 1) * 15}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {100 - (index + 1) * 15}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;