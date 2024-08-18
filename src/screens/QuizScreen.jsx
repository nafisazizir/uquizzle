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
  convertQuestionToPdfAndDownload,
} from "../services/download";
import "./QuizScreen.css";
import { ReactComponent as Graduate } from "../assets/graduation.svg";

function formatTextWithCode(text) {
  const codePattern = /`(.*?)`/g;
  const inlineStyles = `
    background-color: #d4d4d4;
    border-radius: 3px;
    font-family: 'Courier New', Courier, monospace;
    padding: 2px 5px;
    color: #000000;
    font-weight: 200;
    font-size: '10px';
    white-space: pre-wrap;
    display: inline-block;
  `;
  return text
    .split(codePattern)
    .map((segment, index) =>
      index % 2 === 1 ? `<code style="${inlineStyles}">${segment}</code>` : segment
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
      const localStorageQuestions = localStorage.getItem("questions");
      if (localStorageQuestions) {
        setQuestions(JSON.parse(localStorageQuestions));
      } else {
        const generatedQuestions = await generateQuestions(transcriptText);
        setQuestions(generatedQuestions);
        localStorage.setItem("questions", JSON.stringify(generatedQuestions));
        console.log(generatedQuestions)
      }
    };


    const localStorageQuizResult = localStorage.getItem("quizResults");
    if (localStorageQuizResult) {
      setQuizResults(JSON.parse(localStorageQuizResult));
    }

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
      },
    ];
    setQuizResults(newQuizResults);
    localStorage.setItem("quizResults", JSON.stringify(newQuizResults))

    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: selectedOption });
    setAnsweredQuestions([
      ...new Set([...answeredQuestions, currentQuestionIndex]),
    ]);
    setIsSubmitted(true);

    // If this is the last question, log the results
    if (currentQuestionIndex === questions.length - 1) {
      console.log("Quiz Results:", newQuizResults);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setTotalScore(calculateScore());
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

  const calculateScore = () => {
    const correctAnswers = quizResults.filter(quizResults => quizResults.is_correct).length;
    return `${correctAnswers}`;
  }

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