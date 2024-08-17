import React from 'react';

const HomeScreen = ({ onNavigate, lectureTitle, handleTranscribe }) => {
  return (
    <div className="screen-container">
      <h2>Welcome to UQuizzle</h2>
      {lectureTitle && <h3>{lectureTitle}</h3>}
      <button onClick={handleTranscribe}>Transcribe Lecture</button>
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('quiz')}>Go to Quiz</button>
        <button onClick={() => onNavigate('notes')}>Go to Notes</button>
      </div>
    </div>
  );
};

export default HomeScreen;