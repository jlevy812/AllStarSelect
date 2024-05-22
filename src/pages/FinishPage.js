//Finish Page

import React from 'react';
import './../App.css';

function StartPage() {

  return (
    <div className="finishContainer finishOverlay">
      <div className='startPageTopLogos'>
        <div className='startPageMLBLogo'></div>
        <div className='sponsorContainer startSponsor'>
            <div className='poweredByText'>POWERED BY</div>
            <div className='sponsorLogo'></div>
        </div>
      </div>
      <div className='logoContainer'>
        <div className='finishPageUltimateTeamLogo'></div>
        <div className='finishMLBUltimateTeamText'>MLB ULTIMATE TEAM</div>
        <div className='finishExplanationText'>Congratulations on creating your MLB Ultimate Team! </div>
        <div className='finishExplanationText'>Compare with friends and get excited for the World Series... </div>
        <div className='finishExplanationText'>One lucky participant will win a VIP experience!</div>
      </div>
      <div className='shareContainer'>
        <div className='sharePicture'></div>
        <div className='shareText'>SHARE NOW</div>
        <div className='logosLine'>
            <div className='facebookLogo'></div>
            <div className='xLogo'></div>
            <div className='instagramLogo'></div>
        </div>
      </div>
      
    </div>
  );
}

export default StartPage;