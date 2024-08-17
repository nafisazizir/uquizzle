/* global chrome */
import React, { useState, useEffect } from "react";
import { generateFeedback } from "../services/generateFeedback";
import Header from "../components/Header/index";
import WaitingScreen from "./WaitingScreen";
import "./QuizScreen.css";

import questionsJson from "../services/questions.json";

const FeedbackScreen = ({
  transcriptText,
  onNavigate,
  questions,
  userChoice,
}) => {
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const fetchFeedback = async () => {
      const generatedFeedback = await generateFeedback(
        transcriptText,
        questionsJson,
        userChoice
      );
      setFeedback(generatedFeedback);
    };
    fetchFeedback();
  }, [transcriptText, questions, userChoice]);

  if (Object.keys(feedback).length === 0) {
    return <WaitingScreen />;
  }

  return (
    <div>
      <Header onNavigate={onNavigate} />
      <h2>Strength</h2>
      {feedback.strength.map((item, index) => (
        <div key={index} className="feedback-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>{item.topic}</h3>
            <p
              style={{
                margin: 0,
                display: "flex",
                padding: "4px 8px",
                alignItems: "center",
                gap: "5px",
                borderRadius: "22.009px",
                border: "1px solid var(--Danube, #559CCD)",
                fontSize: "12px",
                color: "#559CCD",
              }}
            >
              {item.accuracy}%
            </p>
          </div>
          {/* <p>Questions Covered: {item.questionsCovered.join(", ")}</p> */}
          <ul>
            {item.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Weakness</h2>
      {feedback.weakness.map((item, index) => (
        <div key={index} className="feedback-section">
          <h3>{item.topic}</h3>
          <p>Accuracy: {item.accuracy}%</p>
          <p>Questions Covered: {item.questionsCovered.join(", ")}</p>
          <ul>
            {item.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="feedback-section">
        <h2>Recommendations</h2>
        <ul>
          {feedback.recommendation.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackScreen;
