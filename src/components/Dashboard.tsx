import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Search, BarChart3, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/App';
import JobDescriptionUpload from './JobDescriptionUpload';
import ResumeUpload from './ResumeUpload';
import AnalysisPanel from './AnalysisPanel';

const Dashboard = ({ onBackToHome }: { onBackToHome: () => void }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { signOut } = useAuthContext();

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Recruitment Analyzer</h1>
              <p className="text-sm text-gray-500">Smart candidate matching powered by AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onBackToHome}>
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Upload & Analyze</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <JobDescriptionUpload onUpload={handleRefresh} />
              <ResumeUpload onUpload={handleRefresh} />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6 mt-6">
            <AnalysisPanel key={refreshTrigger} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <span>Total Analyses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">--</div>
                  <p className="text-sm text-gray-500 mt-1">Real-time from database</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-green-600" />
                    <span>High Matches</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">--</div>
                  <p className="text-sm text-gray-500 mt-1">Score ≥ 80%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>Avg. Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">--</div>
                  <p className="text-sm text-gray-500 mt-1">Live calculation</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Common Missing Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cloud Computing (AWS/Azure)</span>
                    <span className="text-sm text-gray-500">Based on analysis data</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Docker & Kubernetes</span>
                    <span className="text-sm text-gray-500">Container technologies</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Machine Learning</span>
                    <span className="text-sm text-gray-500">AI/ML frameworks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Design</span>
                    <span className="text-sm text-gray-500">Architecture skills</span>
                  </div>
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
