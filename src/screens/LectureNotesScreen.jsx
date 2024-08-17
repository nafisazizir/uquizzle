import React from 'react';
import LectureNotes from '../components/LectureNotes';

const LectureNotesScreen = ({ lectureNotes, setLectureNotes, transcriptText, onNavigate, lectureTitle}) => {

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