import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BarChart3, Zap, Target } from 'lucide-react';
import heroImage from '@/assets/hero-recruitment.jpg';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Navigation */}
      <nav className="relative z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-info rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ResumeMatch Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="outline">Sign In</Button>
              <Button variant="hero" onClick={onGetStarted}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="info" className="w-fit">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered Matching
              </Badge>
              <h1 className="text-5xl font-bold leading-tight">
                Find the Perfect
                <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                  {" "}Candidates{" "}
                </span>
                Faster
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Advanced AI resume matching that analyzes skills, experience, and cultural fit. 
                Turn hours of manual screening into minutes of intelligent insights.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Smart Screening</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI analyzes resumes against job requirements with 95% accuracy
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Instant Insights</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get detailed match scores and skill gap analysis instantly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="hero" size="lg" onClick={onGetStarted}>
                <Target className="w-5 h-5 mr-2" />
                Start Matching Now
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Resumes Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Match Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">80%</div>
                <div className="text-sm text-muted-foreground">Time Saved</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Professional recruitment dashboard" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-primary/20 to-info/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-r from-info/20 to-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-info rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-primary rounded-full opacity-25"></div>
        <div className="absolute bottom-40 right-10 w-1 h-1 bg-info rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default Hero;