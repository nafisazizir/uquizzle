/* global chrome */
import React, { useState, useEffect } from 'react';
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

const QuizScreen = ({ transcriptText, onNavigate }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const generatedQuestions = await generateQuestions(transcriptText);
      setQuestions(generatedQuestions);
    };
    fetchQuestions();
  }, [transcriptText]);

  const handleOptionSelect = (optionIndex) => {
    if (!isSubmitted) {
      setSelectedOption(optionIndex);
    }
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newQuizResults = [
      ...quizResults,
      {
        question_id: currentQuestion.question_id,
        user_choice: currentQuestion.options[selectedOption]
      }
    ];
    setQuizResults(newQuizResults);

    setUserAnswers({...userAnswers, [currentQuestionIndex]: selectedOption});
    setAnsweredQuestions([...new Set([...answeredQuestions, currentQuestionIndex])]);
    setIsSubmitted(true);

    // If this is the last question, log the results
    if (currentQuestionIndex === questions.length - 1) {
      console.log('Quiz Results:', newQuizResults);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleJumpTimestamp = () => {
    const timestamp = questions[currentQuestionIndex].timestamp;
    chrome.runtime.sendMessage({ action: "JUMP_TIMESTAMP", timestamp });
  };

  const handleQuestionSelect = (index) => {
    if (quizCompleted) {
      setQuizCompleted(false);
    }
    setCurrentQuestionIndex(index);
    setSelectedOption(userAnswers[index]);
    setIsSubmitted(answeredQuestions.includes(index));
  };

  const handleBackToDashboard = () => {
    onNavigate('home');
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="quiz-screen">
      <Header onNavigate={onNavigate} />
      <ProgressIndicator 
        totalQuestions={questions.length} 
        currentQuestion={currentQuestionIndex}
        answeredQuestions={answeredQuestions}
        onQuestionSelect={handleQuestionSelect}
      />
      {quizCompleted ? (
        <div className="quiz-completion">
          <svg width="154" height="154" viewBox="0 0 154 154" fill="none" xmlns="http://www.w3.org/2000/svg">
          </svg>
          
          <h2>Quiz Conquered! 🎉</h2>
          <p>You've just leveled up your learning with UQuizzle! Review the lecture's material or go back to the dashboard.</p>
          
          <div className="completion-buttons">
            <button className="review-button" onClick={() => console.log('Review Lecture Notes')}>
              Review Lecture Notes
            </button>
            <button className="download-button" onClick={() => console.log('Download Quizzes')}>
              Download Quizzes
            </button>
            <button className="dashboard-button" onClick={handleBackToDashboard}>
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <>
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
            onSubmit={handleSubmit}
            onNextQuestion={handleNextQuestion}
            onJumpTimestamp={handleJumpTimestamp}
            formatTextWithCode={formatTextWithCode}
            selectedOption={selectedOption}
            isSubmitted={isSubmitted}
          />
        </>
      )}
    </div>
  );
};

export default QuizScreen;