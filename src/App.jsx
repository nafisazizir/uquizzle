/* global chrome */
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const App = () => {
  const [lectureTitle, setLectureTitle] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === 'LECTURE_DATA') {
        setLectureTitle(message.title);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  const handleTranscribe = useCallback(() => {
    setTranscriptText('Fetching lecture transcript...');
    chrome.runtime.sendMessage({ action: 'GET_TRANSCRIPT' }, (response) => {
      if (response.error) {
        setTranscriptText(`Error: ${response.error}`);
      } else {
        setTranscriptText('Transcript fetched successfully!');
      }
    });
  }, []);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
    const sidebar = document.getElementById('echo360-transcriber-sidebar');
    const toggleButton = document.getElementById('echo360-transcriber-toggle');
    const body = document.body;
    
    if (isMinimized) {
      sidebar.classList.remove('minimized');
      toggleButton.classList.remove('minimized');
      toggleButton.textContent = 'Minimize';
      body.classList.add('sidebar-open');
    } else {
      sidebar.classList.add('minimized');
      toggleButton.classList.add('minimized');
      toggleButton.textContent = 'Expand';
      body.classList.remove('sidebar-open');
    }
  };

  return (
    <div className="App">
      <h2>Interactive Exercise</h2>
      <button onClick={handleTranscribe}>Transcribe Lecture</button>
      {lectureTitle && <h3>{lectureTitle}</h3>}
      <div>{transcriptText}</div>
    </div>
  );
};

export default App;