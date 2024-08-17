/* global chrome */
import React, { useState, useEffect, useCallback } from "react";
import { generateQuestions } from "./services/generateQuestions";
import { generateLectureNotes } from "./services/generateLectureNotes";
import "./App.css";

const App = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [questions, setQuestions] = useState("");
  const [lectureNotes, setLectureNotes] = useState(
    "No lecture notes generated yet."
  );

  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === "LECTURE_DATA") {
        setLectureTitle(message.title);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  const handleTranscribe = useCallback(() => {
    setTranscriptText("Fetching lecture transcript...");
    chrome.runtime.sendMessage({ action: "GET_TRANSCRIPT" }, (response) => {
      if (response.error) {
        setTranscriptText(`Error: ${response.error}`);
      } else {
        setTranscriptText(response);
      }
    });
  }, []);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
    const sidebar = document.getElementById("echo360-transcriber-sidebar");
    const toggleButton = document.getElementById("echo360-transcriber-toggle");
    const body = document.body;

    if (isMinimized) {
      sidebar.classList.remove("minimized");
      toggleButton.classList.remove("minimized");
      toggleButton.textContent = "Minimize";
      body.classList.add("sidebar-open");
    } else {
      sidebar.classList.add("minimized");
      toggleButton.classList.add("minimized");
      toggleButton.textContent = "Expand";
      body.classList.remove("sidebar-open");
    }
  };

  return (
    <div className="App">
      <h2>Interactive Exercise</h2>
      <button onClick={handleTranscribe}>Transcribe Lecture</button>
      {lectureTitle && <h3>{lectureTitle}</h3>}
      <pre>
        {transcriptText === "" ||
        transcriptText === "Fetching lecture transcript..."
          ? transcriptText
          : "Successfully got the transcript"}
      </pre>

      <button
        onClick={async () => {
          const result = await generateLectureNotes(transcriptText);
          setLectureNotes(result);
        }}
      >
        Generate Lecture Notes
      </button>
      <pre>{JSON.stringify(lectureNotes, null, 2)}</pre>

      <button
        onClick={async () => {
          const result = await generateQuestions(transcriptText);
          setQuestions(result);
        }}
      >
        Generate Questions
      </button>
      <div>
        {questions.length === 0 ? (
          <p>No questions generated yet.</p>
        ) : (
          <ul>
            {questions.map((questionData, index) => (
              <li key={index} className="mb-4">
                <ul className="list-disc pl-4">
                  {questionData.options.map((option, optionIndex) => (
                    <li key={optionIndex}>{option}</li>
                  ))}
                </ul>
                <div>
                  ////////////////
                </div>
              </li>

            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
