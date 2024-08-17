/* global chrome */
import React, { useState, useEffect, useCallback } from "react";
import { generateQuestions } from "./services/generateQuestions";
import { generateLectureNotes } from "./services/generateLectureNotes";
import SidebarBase from "./components/SidebarBase";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";
import NotesScreen from "./screens/NotesScreen";
import WaitingScreen from "./screens/WaitingScreen";
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
  const [currentScreen, setCurrentScreen] = useState("home");
  const [lectureTitle, setLectureTitle] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [lectureNotes, setLectureNotes] = useState("No lecture notes generated yet.");

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

  const handleJumpTimestamp = (timestamp) => {
    chrome.runtime.sendMessage({ action: "JUMP_TIMESTAMP", timestamp });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        // return <HomeScreen 
        //   onNavigate={setCurrentScreen}
        //   lectureTitle={lectureTitle}
        //   handleTranscribe={handleTranscribe}
        // />;
        return <WaitingScreen text="quizzle"/>;
      case "quiz":
        return <QuizScreen 
          questions={questions}
          setQuestions={setQuestions}
          transcriptText={transcriptText}
          onNavigate={setCurrentScreen}
        />;
      case "notes":
        return <NotesScreen 
          lectureNotes={lectureNotes}
          setLectureNotes={setLectureNotes}
          transcriptText={transcriptText}
          onNavigate={setCurrentScreen}
        />;
      default:
        // return <HomeScreen onNavigate={setCurrentScreen} />;
        return <WaitingScreen text="quizzle"/>;
    }
  };

  return (
    <SidebarBase>
      <div className="App">
        {renderScreen()}
      </div>
    </SidebarBase>
  );
};

export default App;
