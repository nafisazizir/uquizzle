import React from 'react';
import { generateLectureNotes } from '../services/generateLectureNotes';
import LectureNotes from '../components/LectureNotes';

const LectureNotesScreen = ({ lectureNotes, setLectureNotes, transcriptText, onNavigate }) => {
  // const handleGenerateNotes = async () => {
  //   const generatedNotes = await generateLectureNotes(transcriptText);
  //   console.log("Notes:", generatedNotes);
  //   setLectureNotes(generatedNotes);
  // };

  return (
    <div className="screen-container">
      <LectureNotes
        lectureNotes={lectureNotes}
        setLectureNotes={setLectureNotes}
        transcriptText={transcriptText}
        onNavigate={onNavigate}
        generateLectureNotes={generateLectureNotes}
      />
    </div>
  );
};

export default LectureNotesScreen;