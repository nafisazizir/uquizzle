import React from 'react';
import Welcome from '../components/Welcome';

const WelcomeScreen = ({ onNavigate, handleTranscribe }) => {
  return (
    <div className="screen-container">
        <Welcome onNavigate={onNavigate} handleTranscribe={handleTranscribe}/>
    </div>
  );
};

export default WelcomeScreen;