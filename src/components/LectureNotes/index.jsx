import React, { useState, useEffect } from "react";
import HeaderBase from "../HeaderBase";
import { ReactComponent as MadeLove } from "../../assets/madelove.svg";
import { generateLectureNotes } from '../../services/generateLectureNotes';
import { convertLectureNotesToMarkdownAndDownload } from '../../services/download';
import "./LectureNotes.css";
import Sparkles from "../Star";
import PulsatingRotatingSVG from "../PulsatingSVG";

const LectureNotes = ( { transcriptText, onNavigate, lectureTitle }) => {
    const [isGenerating, setIsGenerating] = useState(true);
    const [lectureNotes, setLectureNotes] = useState([]);
  
    useEffect(() => {
      const handleGenerateNotes = async () => {
        const localStorageNotes = localStorage.getItem("notes");
        if (localStorageNotes) {
            setLectureNotes(JSON.parse(localStorageNotes));
            setIsGenerating(false)
        } else {
            try {
                const generatedNotes = await generateLectureNotes(transcriptText);
                setLectureNotes(generatedNotes);
                localStorage.setItem("notes", JSON.stringify(generatedNotes));
            } finally {
                setIsGenerating(false);
            }
          }
      };
      handleGenerateNotes();
    }, [transcriptText]);

    return(
        <div className="frame" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", height: "90vh", padding: "5px", boxSizing: "border-box", }}>
            <div style={{ width: "100%" }}>
                <HeaderBase />
            </div>
            <div className="h2-v2">Lecture Notes</div>

            <div className="notes-content">
                { isGenerating ? (
                    <div className="grid-wrapper">
                        <Sparkles>
                            <div className='center-waiting-logo'>
                                <PulsatingRotatingSVG/>
                            </div>
                        </Sparkles>  
                        <div className="grid">
                            <div className="waiting-screen">
                                <div className="ai-generate-text">AI is generating your <span style={{color: "#d5016c"}}>notes...</span></div>
                                <div className="mini-text">You will be able to download the lecture notes once generated</div>
                            </div>
                        </div>
                    </div>
            ) :  (
                    <>
                        {lectureNotes.map((topic, index) => (
                            <div className="each-topic">
                                <div key={index}>
                                    <div className="content-title">{topic.title}</div>
                                    <ul>
                                        {topic.content.map((content, id) => (
                                            <li key={id}>{content.text}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Nav Buttons */}
            <div className="navigation-buttons-2">
                <button class="download-button" disabled={isGenerating} onClick={() => convertLectureNotesToMarkdownAndDownload(lectureTitle)}>Download Notes</button>
                <button class="dashboard-button-2" onClick={() => onNavigate('home')}>Back to Dashboard</button>
            </div>
            
            
            {/* Footer */}
            <div style={{   width: "100%",   display: "flex",   justifyContent: "center",   alignItems: "center",   padding: "10px 0", }}>
              <MadeLove />
            </div>
        </div>
    );
};

export default LectureNotes;