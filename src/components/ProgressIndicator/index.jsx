import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ totalQuestions, currentQuestion, answeredQuestions, onQuestionSelect }) => (
  <div className="progress-indicator">
    {[...Array(totalQuestions)].map((_, index) => (
      <div 
        key={index}
        className={`indicator ${
          index < currentQuestion ? 'completed' : 
          index === currentQuestion ? 'current' : 'upcoming'
        } ${answeredQuestions.includes(index) ? 'answered' : ''}`}
        onClick={() => answeredQuestions.includes(index) && onQuestionSelect(index)}
      >
        <span className="indicator-number">{index + 1}</span>
      </div>
    ))}
  </div>
);

export default ProgressIndicator;