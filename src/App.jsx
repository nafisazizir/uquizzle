/* global chrome */
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const App = () => {
  const [lectureTitle, setLectureTitle] = useState('');
  const [transcriptText, setTranscriptText] = useState('');

  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === 'LECTURE_DATA') {
        setLectureTitle(message.title);
      }
    };

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup listener on unmount
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  const handleTranscribe = useCallback(() => {
    setTranscriptText('Fetching lecture transcript...');
    chrome.runtime.sendMessage({ action: 'GET_TRANSCRIPT' }, (response) => {
      if (response.error) {
        setTranscriptText(`Error: ${response.error}`);
      } else {
        setTranscriptText('Transcript fetched successfully!');
        // Process and display the transcript here
      }
    });
  }, []);

  return (
    <div className="App">
      <h1>Echo360 Lecture Transcriber</h1>
      <button onClick={handleTranscribe}>Transcribe Lecture</button>
      {lectureTitle && <h2>{lectureTitle}</h2>}
      <div>{transcriptText}</div>
    </div>
  );
};

export default App;