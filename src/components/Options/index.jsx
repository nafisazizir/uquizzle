import React, { useState, useEffect } from 'react';

const Options = ({ options, correctAnswer, explanations, onSelect, onNextQuestion, onJumpTimestamp, formatTextWithCode }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedOption, setExpandedOption] = useState(null);

  useEffect(() => {
    // Reset state when moving to a new question
    setSelectedOption(null);
    setIsSubmitted(false);
    setExpandedOption(null);
  }, [options]);

  const handleOptionClick = (index) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null && !isSubmitted) {
      setIsSubmitted(true);
      onSelect(selectedOption);
    }
  };

  const handleAccordionToggle = (index) => {
    if (isSubmitted) {
      setExpandedOption(expandedOption === index ? null : index);
    }
  };

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
        {isSubmitted ? 'Click to see explanation of each answer:' : 'Choose one of the options below:'}
      </p>
      <div className="options-list">
        {options.map((option, index) => (
          <div key={index} className="option-container">
            <button 
              className={getOptionClass(index)}
              onClick={() => isSubmitted ? handleAccordionToggle(index) : handleOptionClick(index)}
              dangerouslySetInnerHTML={{ __html: formatTextWithCode(option) }}
            />
            {isSubmitted && expandedOption === index && (
              <div 
                className="explanation"
                dangerouslySetInnerHTML={{ __html: formatTextWithCode(explanations[index]) }}
              />
            )}
          </div>
        ))}
      </div>
      {!isSubmitted && selectedOption !== null && (
        <button className="submit-button" onClick={handleSubmit}>
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