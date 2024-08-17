import React from 'react';
import { generateLectureNotes } from '../services/generateLectureNotes';

const NotesScreen = ({ lectureNotes, setLectureNotes, transcriptText, onNavigate }) => {
  const handleGenerateNotes = async () => {
    const generatedNotes = await generateLectureNotes(transcriptText);
    console.log("Notes:", generatedNotes);
    setLectureNotes(generatedNotes);
  };

  return (
    <div className="screen-container">
      <h2>Lecture Notes</h2>
      <button onClick={handleGenerateNotes}>Generate Lecture Notes</button>
      <div className="notes-content">
        <pre>{JSON.stringify(lectureNotes, null, 2)}</pre>
      </div>
      <div className="navigation-buttons">
        <button onClick={() => onNavigate('home')}>Back to Home</button>
        <button onClick={() => onNavigate('quiz')}>Go to Quiz</button>
      </div>
    </div>
  );
};

export default NotesScreen;