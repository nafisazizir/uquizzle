import React from 'react';
import { convertQuestionToMarkdownAndDownload, convertLectureNotesToMarkdownAndDownload } from '../services/download';

const HomeScreen = ({ onNavigate, lectureTitle, handleTranscribe }) => {
  return (
    <div className="screen-container">
      <h2>Welcome to UQuizzle</h2>
      {lectureTitle && <h3>{lectureTitle}</h3>}
      <button onClick={handleTranscribe}>Transcribe Lecture</button>
      <button onClick={() => convertQuestionToMarkdownAndDownload(lectureTitle)}>Download Question</button>
      <button onClick={() => convertLectureNotesToMarkdownAndDownload(lectureTitle)}>Download Lecture Notes</button>
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('quiz')}>Go to Quiz</button>
        <button onClick={() => onNavigate('notes')}>Go to Notes</button>
      </div>
    </div>
  );
};

export default HomeScreen;