//Start Page

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../App.css';

function StartPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/AllStarSelect/SelectPage');
  };

  return (
    <div className="startContainer startOverlay">
      <div className='startPageTopLogos'>
        <div className='startPageMLBLogo'></div>
        <div className='sponsorContainer startSponsor'>
            <div className='poweredByText'>POWERED BY</div>
            <div className='sponsorLogo'></div>
        </div>
      </div>
      <div className='startPageUltimateTeamLogo'></div>
      <div className='MLBUltimateTeamText'>MLB ULTIMATE TEAM</div>
      <div className='explanationText'>The 2024 Season is on and many greats are battling it out on the field. But what if you could put them all together?</div>
      <div className='explanationText'>Create your MLB Untimate Team now for a chance to win a VIP World Series experience</div>
      <div className='signupTextBoxes'>
        <div className="inputBox">
          <input type="text" className="inputField" placeholder='FIRST NAME'/>
        </div>
        <div className="inputBox">
          <input type="text" className="inputField" placeholder='LAST NAME'/>
        </div>
        <div className="inputBox">
          <input type="text" className="inputField" placeholder='EMAIL'/>
        </div>
      </div>
      <button className="submitButton" onClick={handleClick}>START</button>
      <div className='permissionText'>By completing this form, you grant the MLB and Capital One</div>
      <div className='permissionText'>permission to contact you for marketing purposes.</div>
    </div>
  );
}

export default StartPage;