import React from 'react';
import './CenterWaiting.css';
import Sparkles from '../Star';


const CenterWaiting= () => {
    return(
        <div className="center-waiting-container">
            <Sparkles>
                <div className='center-waiting-logo'>
                    <svg width="96" height="92" viewBox="0 0 29 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="14.7638" cy="11.4177" r="9.62029" fill="#D5016C"/>
                        <circle cx="14.8591" cy="11.5127" r="7.81053" fill="#AF0159"/>
                        <circle cx="14.859" cy="11.5125" r="6.09602" fill="#90268E"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.01645 0C3.55462 1.29255 2.36168 2.86037 1.50576 4.61395C0.649836 6.36753 0.147689 8.27253 0.0279857 10.2202C-0.0917171 12.1678 0.173369 14.12 0.80811 15.9652C1.44285 17.8104 2.43481 19.5125 3.72736 20.9743C5.01991 22.4361 6.58774 23.6291 8.34132 24.485C10.0949 25.3409 11.9999 25.8431 13.9475 25.9628C15.8952 26.0825 17.8473 25.8174 19.6925 25.1826C21.4012 24.5949 22.9872 23.7008 24.3733 22.5453L22.706 20.878C21.5785 21.7858 20.3008 22.492 18.9293 22.9638C17.3754 23.4983 15.7316 23.7215 14.0915 23.6207C12.4514 23.5199 10.8472 23.0971 9.37057 22.3763C7.8939 21.6556 6.57366 20.651 5.48522 19.42C4.39678 18.189 3.56147 16.7557 3.02696 15.2019C2.49245 13.6481 2.26923 12.0042 2.37003 10.3641C2.47083 8.72403 2.89368 7.11987 3.61444 5.6432C4.3352 4.16654 5.33975 2.8463 6.57074 1.75786L5.01645 0Z" fill="#231F20"/>
                        <path d="M23.4463 20.0854L27.2416 23.7203" stroke="#AF0159" stroke-width="2.28601"/>
                    </svg>
                </div>
            </Sparkles>  
            <Sparkles>
                <div className='center-waiting-text'>
                    <h5>AI is curating your <span className="highlight-text">quizzles</span></h5>
                    <h6>Questions will pop up here as you watch the lecture</h6>
                                    
                </div>  
            </Sparkles>
            
        </div>
    )
}

export default CenterWaiting;