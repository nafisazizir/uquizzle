import React from 'react';

const Question = ({ questionNumber, questionText, formatTextWithCode }) => (
  <div className="question">
    <div className="question-number">Question {questionNumber}</div>
    <h4 className="question-text" dangerouslySetInnerHTML={{ __html: formatTextWithCode(questionText) }} />
  </div>
);

export default Question;