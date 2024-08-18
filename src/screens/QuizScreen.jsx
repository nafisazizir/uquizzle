/* global chrome */
import React, { useState, useEffect } from "react";
import { generateQuestions } from "../services/generateQuestions";
import Header from "../components/Header/index";
import ProgressIndicator from "../components/ProgressIndicator/index";
import Question from "../components/Question/index";
import Options from "../components/Options/index";
import WaitingScreen from "./WaitingScreen";
import {
  convertQuestionToMarkdownAndDownload,
} from "../services/download";
import "./QuizScreen.css";
import { ReactComponent as Graduate } from "../assets/graduation.svg";

function formatTextWithCode(text) {
  const codePattern = /'''(.*?)'''/g;
  return text
    .split(codePattern)
    .map((segment, index) =>
      index % 2 === 1 ? `<code>${segment}</code>` : segment
    )
    .join("");
}

const QuizScreen = ({ transcriptText, onNavigate, lectureTitle }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [totalScore, setTotalScore] = useState("0/10");

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
    const isCorrect = currentQuestion.options[selectedOption] === currentQuestion.correctAnswer;
    const newQuizResults = [
      ...quizResults,
      {
        question_id: currentQuestion.question_id,
        user_choice: currentQuestion.options[selectedOption],
        is_correct: isCorrect
      }
    ];
    setQuizResults(newQuizResults);

    setUserAnswers({...userAnswers, [currentQuestionIndex]: selectedOption});
    setAnsweredQuestions([...new Set([...answeredQuestions, currentQuestionIndex])]);
    setIsSubmitted(true);

    if (currentQuestionIndex === questions.length - 1) {
      handleQuizCompletion(newQuizResults);
    }
  };

  const handleQuizCompletion = (results) => {
    const score = calculateScore(results);
    setTotalScore(score);
    setQuizCompleted(true);
  };

  const calculateScore = (results) => {
    const correctAnswers = results.filter(result => result.is_correct).length;
    return `${correctAnswers}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      handleQuizCompletion(quizResults);
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
    onNavigate("home");
  };

  const handleDownloadQuizzes = async () => {
    try {
      await convertQuestionToMarkdownAndDownload(lectureTitle);
    } catch (error) {
      console.error("Error downloading quizzes:", error);
      // You might want to show an error message to the user here
    }
  };


  const handleViewFeedback = () => {
    onNavigate("feedback", { 
      transcriptText, 
      questions, 
      quizResults, 
      score: totalScore 
    });
  };

  if (questions.length === 0) {
    return <WaitingScreen />;
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

          <div className="score">
            <h1 className="scorename">Score</h1>
            <p className="answer-text">
              <span className="answer">{totalScore}</span>/10
            </p>
            <p style={{
              marginTop:"0px",
            }}>See your detailed feedback, <span className="here" onClick={handleViewFeedback}>here</span>!</p>
          </div>
          <Graduate/>

          <h2>Quiz Conquered! 🎉</h2>
          <p className="message">
            You've just leveled up your learning with <span className="red">UQuizzle!</span> Review the
            lecture's material or go back to the dashboard.
          </p>

          <div className="completion-buttons">
            <button className="review-button" onClick={() => onNavigate("notes")}>
              Review Lecture Notes
            </button>
            <button className="download-button" onClick={handleDownloadQuizzes} style={{backgroundColor:"white", color:"rgba(213, 1, 108, 1)", border: "2px solid var(--strawbz) !important" }}>
              Download Quizzes
            </button>
            <button
              className="dashboard-button"
              onClick={handleBackToDashboard}
              style={{backgroundColor:"white", color:"rgba(213, 1, 108, 1)" }}
            >
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
            correctAnswer={questions[currentQuestionIndex].options.indexOf(
              questions[currentQuestionIndex].correctAnswer
            )}
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
