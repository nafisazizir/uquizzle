/* global chrome */
import React, { useState, useEffect, useCallback } from "react";
import { generateQuestions } from "./services/generateQuestions";
import { generateLectureNotes } from "./services/generateLectureNotes";
import SidebarBase from "./components/SidebarBase";
import "./components/SidebarBase/SidebarBase.css";
import "./App.css";

// Function to format text and wrap code snippets in <code> tags
function formatTextWithCode(text) {
  const codePattern = /'''(.*?)'''/g;
  return text.split(codePattern).map((segment, index) =>
    index % 2 === 1
      ? `<code>${segment}</code>`  // Wrap code segments
      : segment  // Leave normal text as is
  ).join('');
}

const App = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
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

  // timestamp in ms
  const handleJumpTimestamp = (timestamp) => {
    chrome.runtime.sendMessage({ action: "JUMP_TIMESTAMP", timestamp });
  };

  return (
    <SidebarBase>
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
                  <h4 dangerouslySetInnerHTML={{ __html: formatTextWithCode(questionData.question) }} />
                  <ul className="list-disc pl-4">
                    {questionData.options.map((option, optionIndex) => (
                      <li key={optionIndex} dangerouslySetInnerHTML={{ __html: formatTextWithCode(option) }} />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SidebarBase>
  );
};

export default App;
