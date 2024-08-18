import React from 'react';
import './CenterWaiting.css';
import Sparkles from '../Star';
import PulsatingRotatingSVG from '../PulsatingSVG';


const CenterWaiting= () => {
    return(
        <div className="center-waiting-container">
            <Sparkles>
                <div className='center-waiting-logo'>
                    <PulsatingRotatingSVG/>
                </div>
            </Sparkles>  
            <Sparkles>
                <div className='center-waiting-text'>
                    <h5>AI is curating your <span className="highlight-text">quizzles</span></h5>
                    {/* <h6 style={{
                fontSize: "14px"
                }} >Questions will pop up here as you watch the lecture</h6> */}
                <p style={{
                color: "#6E6E6E",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: "400"
                }} >Remember to pay attention to the lecture!</p>
                </div>  
            </Sparkles>
            
        </div>
    )
}

export default CenterWaiting;