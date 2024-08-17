import React from 'react';
import QuizzleWordLogo from '../components/QuizzleWordLogo';
import CenterWaiting from '../components/CenterWaiting';
import Footer from '../components/Footer';
import './WaitingScreen.css'



const WaitingScreen = () => {
    return(
        <div className='waiting-screen-container'>
            <QuizzleWordLogo/>
            <CenterWaiting/>  
            <div className="lecture-reminder">Remember to pay attention to the lecture!</div>
            <Footer/>            
        </div>
    )
}

export default WaitingScreen;