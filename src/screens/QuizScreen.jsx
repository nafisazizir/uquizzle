/* global chrome */
import React, { useState } from 'react';
import { generateQuestions } from '../services/generateQuestions';
import Header from '../components/Header/index';
import ProgressIndicator from '../components/ProgressIndicator/index';
import Question from '../components/Question/index';
import Options from '../components/Options/index';
import './QuizScreen.css';

function formatTextWithCode(text) {
  const codePattern = /'''(.*?)'''/g;
  return text.split(codePattern).map((segment, index) =>
    index % 2 === 1
      ? `<code>${segment}</code>`
      : segment
  ).join('');
}

const QuizScreen = ({ questions, setQuestions, transcriptText, onNavigate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleGenerateQuestions = async () => {
    const generatedQuestions = await generateQuestions(transcriptText);
    console.log("Questions:", generatedQuestions);
    setQuestions(generatedQuestions);
  };

  const handleOptionSelect = (optionIndex) => {
    console.log(`Selected option: ${optionIndex}`);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("Quiz completed");
    }
  };

  const handleJumpTimestamp = () => {
    const timestamp = questions[currentQuestionIndex].timestamp;
    chrome.runtime.sendMessage({ action: "JUMP_TIMESTAMP", timestamp });
  };

  return (
    <div className="quiz-screen">
      <Header onNavigate={onNavigate} />
      {questions.length === 0 ? (
        <div className="screen-container">
          <h2>Quiz</h2>
          <button onClick={handleGenerateQuestions}>Generate Questions</button>
          <p>No questions generated yet.</p>
        </div>
      ) : (
        <>
          <ProgressIndicator totalQuestions={questions.length} currentQuestion={currentQuestionIndex} />
          <Question 
            questionNumber={currentQuestionIndex + 1} 
            questionText={questions[currentQuestionIndex].question}
            formatTextWithCode={formatTextWithCode}
          />
          <Options 
            options={questions[currentQuestionIndex].options} 
            correctAnswer={questions[currentQuestionIndex].options.indexOf(questions[currentQuestionIndex].correctAnswer)}
            explanations={questions[currentQuestionIndex].explanation}
            onSelect={handleOptionSelect}
            onNextQuestion={handleNextQuestion}
            onJumpTimestamp={handleJumpTimestamp}
            formatTextWithCode={formatTextWithCode}
          />
        </>
      )}
    </div>
  );
};

export default QuizScreen;