import React, { useState, useEffect } from 'react';
import Header from "../components/Header/index";
import WaitingScreen from "./WaitingScreen";
import { generateFeedback } from '../services/generateFeedback';
import "./FeedbackScreen.css";

const FeedbackScreen = ({ onNavigate, transcriptText, questions, quizResults, score }) => {
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPositiveOpen, setIsPositiveOpen] = useState(true);
  const [isNegativeOpen, setIsNegativeOpen] = useState(true);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const generatedFeedback = await generateFeedback(transcriptText, questions, quizResults);
        setFeedback(generatedFeedback);
        setIsLoading(false);
      } catch (error) {
        console.error("Error generating feedback:", error);
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [transcriptText, questions, quizResults]);

  const handleBackToDashboard = () => {
    onNavigate('home');
  };

  if (isLoading) {
    return <WaitingScreen isFeedback={true} />;
  }

  return (
    <div>
      <Header onNavigate={onNavigate} className="sticky-header"/>

      <div className="score">
        <h1 className="scorename">Score</h1>
        <h2>
          <span className="answer">{score}</span>/10
        </h2>
      </div>

      <div className="aspect" onClick={() => setIsPositiveOpen(!isPositiveOpen)}>
        <h3>Positive</h3>
        <p className={`arrow ${isPositiveOpen ? 'up' : 'down'}`}>▼</p>
      </div>
      
      <div className={`feedback-container ${isPositiveOpen ? 'open' : ''}`}>
        {feedback.strength.map((item, index) => (
          <div key={index} className="feedback-item">
            <div className="topic">
              <h3>Topic {index + 1}: {item.topic}</h3>
              <p className={`accuracy ${item.accuracy >= 60 ? 'high' : 'low'}`}>{item.accuracy}%</p>
            </div>
            <div className="keypoints">
              <h3 className="key">Key points:</h3>
              <ul>
                {item.keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div> 
          </div>
        ))}
      </div>

      <div className="aspect" onClick={() => setIsNegativeOpen(!isNegativeOpen)}>
        <h3>Negative</h3>
        <p className={`arrow ${isNegativeOpen ? 'up' : 'down'}`}>▼</p>
      </div>
      
      <div className={`feedback-container ${isNegativeOpen ? 'open' : ''}`}>
        {feedback.weakness.map((item, index) => (
          <div key={index} className="feedback-item">
            <div className="topic">
              <h3>Topic {index + 1}: {item.topic}</h3>
              <p className={`accuracy ${item.accuracy >= 60 ? 'high' : 'low'}`}>{item.accuracy}%</p>
            </div>
            <div className="keypoints">
              <h3 className="key">Key points:</h3>
              <ul>
                {item.keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div> 
          </div>
        ))}
      </div>

      <div className="aspect" onClick={() => setIsRecommendationOpen(!isRecommendationOpen)}>
        <h3>Recommendation</h3>
        <p className={`arrow ${isRecommendationOpen ? 'up' : 'down'}`}>▼</p>
      </div>
      
      <div className={`feedback-container ${isRecommendationOpen ? 'open' : ''}`}>
        <div className="feedback-item">
          <div className="keypoints">
            <ul>
              {feedback.recommendation.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="completion">
        <button className="dashboard-button" onClick={handleBackToDashboard}>
          Back to Dashboard
        </button>
      </div>
      
    </div>
  );
};

export default FeedbackScreen;