import React from 'react';
import { generateQuestions } from '../services/generateQuestions';

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
              <div className="font-bold">{questionData.questions}</div>
              <ul className="list-disc pl-4">
                {questionData.options.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ul>
              <div className="text-sm text-gray-500">
                Correct Option Index: {questionData.correctOptionIndex}
              </div>
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