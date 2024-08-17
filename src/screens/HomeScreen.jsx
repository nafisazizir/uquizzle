import React, { useState } from 'react';
import { convertQuestionToMarkdownAndDownload, convertLectureNotesToMarkdownAndDownload } from '../services/download';
import { generateFeedback } from '../services/generateFeedback';
import questions from "../services/questions.json";
import userChoice from "../services/userChoice.json";

const HomeScreen = ({ onNavigate, lectureTitle, handleTranscribe, transcriptText }) => {
  const [userPerformance, setUserPerformance] = useState("");
  const handleGenerateFeedback = async () => {
    try {
      const feedback = await generateFeedback(transcriptText, questions, userChoice);
      setUserPerformance(feedback); // Update state with feedback
    } catch (error) {
      console.error("Error generating feedback:", error);
    }
  };

  return (
    <div className="screen-container">
      <h2>Welcome to UQuizzle</h2>
      {lectureTitle && <h3>{lectureTitle}</h3>}
      <button onClick={handleTranscribe}>Transcribe Lecture</button>
      <button onClick={() => convertQuestionToMarkdownAndDownload(lectureTitle)}>Download Question</button>
      <button onClick={() => convertLectureNotesToMarkdownAndDownload(lectureTitle)}>Download Lecture Notes</button>
      <button onClick={handleGenerateFeedback}>Generate Feedback</button>
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('quiz')}>Go to Quiz</button>
        <button onClick={() => onNavigate('notes')}>Go to Notes</button>
      </div>
      <pre>{JSON.stringify(userPerformance, null, 2)}</pre>
    </div>
  );
};

export default HomeScreen;