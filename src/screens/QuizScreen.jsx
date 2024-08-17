import React from 'react';
import { generateQuestions } from '../services/generateQuestions';

function formatTextWithCode(text) {
    const codePattern = /'''(.*?)'''/g;
    return text.split(codePattern).map((segment, index) =>
      index % 2 === 1
        ? `<code>${segment}</code>`  // Wrap code segments
        : segment  // Leave normal text as is
    ).join('');
  }

const QuizScreen = ({ questions, setQuestions, transcriptText, onNavigate }) => {
  const handleGenerateQuestions = async () => {
    const generatedQuestions = await generateQuestions(transcriptText);
    console.log("Questions:", generateQuestions);
    setQuestions(generatedQuestions);
  };

  return (
    <div className="screen-container">
      <h2>Quiz</h2>
      <button onClick={handleGenerateQuestions}>Generate Questions</button>
      {questions.length === 0 ? (
        <p>No questions generated yet.</p>
      ) : (
        <ul>
              {questions.map((questionData, index) => (
                <li key={index} className="mb-4">
                  <h4 dangerouslySetInnerHTML={{ __html: formatTextWithCode(questionData.question) }} />
                  <ul className="list-disc pl-4">
                    {questionData.options.map((option, optionIndex) => (
                      <li key={optionIndex} dangerouslySetInnerHTML={{ __html: formatTextWithCode(option) }} />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
      )}
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('home')}>Back to Home</button>
        <button onClick={() => onNavigate('notes')}>Go to Notes</button>
      </div>
    </div>
  );
};

export default QuizScreen;