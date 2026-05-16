import React, { useState } from 'react';
import LandingPage  from './LandingPage';
import ResultsPage  from './ResultsPage';

export default function App() {
  const [screen, setScreen]       = useState('landing');
  const [resumeText, setResumeText] = useState('');

  function handleStart(text) {
    setResumeText(text);
    setScreen('results');
  }

  function handleReset() {
    setResumeText('');
    setScreen('landing');
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      {screen === 'landing' && <LandingPage onStart={handleStart} />}
      {screen === 'results' && <ResultsPage resumeText={resumeText} onReset={handleReset} />}
    </div>
  );
}
