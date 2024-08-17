import React from 'react';
import Welcome from '../components/Welcome';

const WelcomeScreen = ({ onNavigate }) => {
  return (
    <div className="screen-container">
        <Welcome onNavigate={onNavigate} />
      {/* <h2>Welcome to UQuizzle</h2>
      {lectureTitle && <h3>{lectureTitle}</h3>}
      <button onClick={handleTranscribe}>Transcribe Lecture</button>
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('quiz')}>Go to Quiz</button>
        <button onClick={() => onNavigate('notes')}>Go to Notes</button>
      </div> */}
    </div>
  );
};

export default WelcomeScreen;