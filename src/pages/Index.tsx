import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';
import { useAuthContext } from '@/App';

const Index = () => {
  const { session, loading } = useAuthContext();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (session && !loading) {
      setShowDashboard(true);
    } else {
      setShowDashboard(false);
    }
  }, [session, loading]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading spinner
  }

  if (showDashboard) {
    return <Dashboard onBackToHome={() => setShowDashboard(false)} />;
  }

  return <Hero onGetStarted={() => setShowDashboard(true)} />;
};

export default Index;
