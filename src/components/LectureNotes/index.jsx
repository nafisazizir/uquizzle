import React from "react";
import HeaderBase from "../HeaderBase";
import { ReactComponent as MadeLove } from "../../assets/madelove.svg";
import "./LectureNotes.css";


const LectureNotes = ( { lectureNotes, setLectureNotes, transcriptText, onNavigate, generateLectureNotes }) => {
    const handleGenerateNotes = async () => {
        const generatedNotes = await generateLectureNotes(transcriptText);
        console.log("Notes:", generatedNotes);
        setLectureNotes(generatedNotes);
    };

    return(
        <div className="frame" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "90vh", padding: "10px", boxSizing: "border-box", }}>
            <div style={{ width: "100%" }}>
                <HeaderBase />
            </div>

            <div className="title" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <h2>AI is generating your <span style={{color: "#d5016c"}}>notes</span></h2>
            </div>

            <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "16px", color: "#6B6B6B"}}>
                You will be able to download the lecture notes once generated
            </h3>
            
            <button onClick={handleGenerateNotes}>Generate Lecture Notes</button>
            <div className="notes-content">
              <pre>{JSON.stringify(lectureNotes, null, 2)}</pre>
            </div>
            <div className="navigation-buttons">
              <button onClick={() => onNavigate('home')}>Back to Home</button>
              <button onClick={() => onNavigate('quiz')}>Go to Quiz</button>
            </div>
            
            {/* Footer */}
            <div style={{   width: "100%",   display: "flex",   justifyContent: "center",   alignItems: "center",   padding: "10px 0", }}>
              <MadeLove />
            </div>
        </div>
    );
};

export default LectureNotes;