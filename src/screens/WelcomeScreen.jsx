import React from 'react';
import Welcome from '../components/Welcome';

const WelcomeScreen = ({ onNavigate }) => {
  return (
    <div className="screen-container">
        <Welcome onNavigate={onNavigate} />
    </div>
  );
};

export default WelcomeScreen;