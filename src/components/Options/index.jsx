import React, { useState, useEffect } from 'react';

const Options = ({ 
  options, 
  correctAnswer, 
  explanations, 
  onSelect, 
  onSubmit,
  onNextQuestion, 
  onJumpTimestamp, 
  formatTextWithCode, 
  selectedOption, 
  isSubmitted,
  quizLastQuestion
}) => {
  const [openExplanation, setOpenExplanation] = useState(null);
  const [nextButtonText, setNextButtonText] = useState('Next Question');

  useEffect(() => {
    if (isSubmitted) {
      setOpenExplanation(selectedOption);
    } else {
      setOpenExplanation(null);
    }
  }, [isSubmitted, selectedOption]);

  const getOptionClass = (index) => {
    if (!isSubmitted && index === selectedOption) return 'option-button selected';
    if (!isSubmitted) return 'option-button';
    if (index === correctAnswer) return 'option-button correct';
    if (index === selectedOption) return 'option-button incorrect';
    return 'option-button';
  };

  const handleOptionClick = (index) => {
    if (!isSubmitted) {
      onSelect(index);
    } else {
      setOpenExplanation(openExplanation === index ? null : index);
    }
  };

  useEffect(() => {
    if (quizLastQuestion) {
      setNextButtonText('Finish Quiz');
    }
  }, [quizLastQuestion]);

  return (
    <div className="options">
      <p className="options-instruction">
        {isSubmitted ? 'Click to see explanation of each answer:' : 'Choose one of the options below:'}
      </p>
      <div className="options-list">
        {options.map((option, index) => (
          <div key={index} className="option-container">
            <button 
              className={getOptionClass(index)}
              onClick={() => handleOptionClick(index)}
              dangerouslySetInnerHTML={{ __html: formatTextWithCode(option) }}
            />
            {isSubmitted && openExplanation === index && (
              <div className="explanation">
                <div dangerouslySetInnerHTML={{ __html: formatTextWithCode(explanations[index]) }} />
              </div>
            )}
          </div>
        ))}
      </div>
      {!isSubmitted && selectedOption !== null && (
        <button className="submit-button" onClick={onSubmit}>
          Submit
        </button>
      )}
      {isSubmitted && (
        <div className="post-submit-buttons">
          <button className="next-question-button" onClick={onNextQuestion}>
            {nextButtonText}
          </button>
          <button className="timestamp-button" onClick={onJumpTimestamp}>
            Review Section
          </button>
        </div>
      )}
    </div>
  );
};

export default Options;