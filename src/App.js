import React, { useState } from 'react';
import LandingPage  from './LandingPage';
import SetupPage    from './SetupPage';
import ResultsPage  from './ResultsPage';

export default function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'setup' | 'results'
  const [session, setSession] = useState(null);    // { apiKey, resumeText }

  function handleGetStarted() { setScreen('setup'); }
  function handleBack()        { setScreen('landing'); }

  function handleSetupComplete({ apiKey, resumeText }) {
    setSession({ apiKey, resumeText });
    setScreen('results');
  }

  function handleReset() {
    setSession(null);
    setScreen('setup');
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {screen === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {screen === 'setup' && (
        <SetupPage onComplete={handleSetupComplete} onBack={handleBack} />
      )}
      {screen === 'results' && session && (
        <ResultsPage
          apiKey={session.apiKey}
          resumeText={session.resumeText}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
