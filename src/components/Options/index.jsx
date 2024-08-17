import React from 'react';

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
  isSubmitted 
}) => {
  const getOptionClass = (index) => {
    if (!isSubmitted && index === selectedOption) return 'option-button selected';
    if (!isSubmitted) return 'option-button';
    if (index === correctAnswer) return 'option-button correct';
    if (index === selectedOption) return 'option-button incorrect';
    return 'option-button';
  };

  return (
    <div className="options">
      <p className="options-instruction">
        {isSubmitted ? 'Explanation for your answer:' : 'Choose one of the options below:'}
      </p>
      <div className="options-list">
        {options.map((option, index) => (
          <div key={index} className="option-container">
            <button 
              className={getOptionClass(index)}
              onClick={() => !isSubmitted && onSelect(index)}
              dangerouslySetInnerHTML={{ __html: formatTextWithCode(option) }}
            />
            {isSubmitted && index === selectedOption && (
              <div 
                className="explanation"
                dangerouslySetInnerHTML={{ __html: formatTextWithCode(explanations[index]) }}
              />
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
            Next Question
          </button>
          <button className="timestamp-button" onClick={onJumpTimestamp}>
            Timestamp to Explanation
          </button>
        </div>
      )}
    </div>
  );
};

export default Options;