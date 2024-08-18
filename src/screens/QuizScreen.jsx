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
      const localStorageQuestions = localStorage.getItem("questions");
      if (localStorageQuestions) {
        setQuestions(JSON.parse(localStorageQuestions));
      } else {
        const generatedQuestions = await generateQuestions(transcriptText);
        setQuestions(generatedQuestions);
        localStorage.setItem("questions", JSON.stringify(generatedQuestions));
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
    return `${correctAnswers}/${quizResults.length}`;
  }

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
          <svg
            width="154"
            height="154"
            viewBox="0 0 154 154"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          ></svg>

          <h2>Quiz Conquered! 🎉</h2>
          <p>
            You've just leveled up your learning with UQuizzle! Review the
            lecture's material or go back to the dashboard.
          </p>

          <h3>Score: {totalScore}</h3>

          <div className="completion-buttons">
<<<<<<< HEAD
            <button
              className="review-button"
              onClick={() => console.log("Review Lecture Notes")}
            >
=======
            <button className="review-button" onClick={() => onNavigate("notes")}>
>>>>>>> b2e0312 (tweak: integrate button in quiz to connect to lecture notes)
              Review Lecture Notes
            </button>
            <button className="download-button" onClick={handleDownloadQuizzes}>
              Download Quizzes
            </button>
            <button
              className="dashboard-button"
              onClick={handleBackToDashboard}
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
