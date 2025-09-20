import { useState } from 'react';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard />;
  }

  return <Hero onGetStarted={() => setShowDashboard(true)} />;
};

export default Index;
