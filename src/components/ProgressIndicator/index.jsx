import React from 'react';

const ProgressIndicator = ({ totalQuestions, currentQuestion }) => (
  <div className="progress-indicator">
    {[...Array(totalQuestions)].map((_, index) => (
      <div 
        key={index} 
        className={`indicator ${
          index < currentQuestion ? 'completed' : 
          index === currentQuestion ? 'current' : 'upcoming'
        }`}
      />
    ))}
  </div>
);

export default ProgressIndicator;