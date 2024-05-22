// PlayerSelectPage.js
//API Used: statsapi.mlb.com

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../App.css';

function PlayerSelectPage() {
    const navigate = useNavigate();
    const [onPosition, setOnPosition] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState("All");
    const [playersData, setPlayersData] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [isOverlay, setIsOverlay] = useState(true);
    const [isBlur, setIsBlur] = useState(false);
    const [positionText, setPositionText] = useState("");
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [selectedPlayerName, setSelectedPlayerName] = useState(null);
    const [numPlayersSelected, setNumPlayersSelected] = useState(0);
    const [positionSelectedName, setPositionSelectedName] = useState({
      "1B": "SELECT",
      "2B": "SELECT",
      "SS": "SELECT",
      "3B": "SELECT",
      "C": "SELECT",
      "LF": "SELECT",
      "CF": "SELECT",
      "RF": "SELECT",
      "DH": "SELECT",
      "P": "SELECT"
    });
    const positionNames = {
      "1B": "FIRST BASEMAN",
      "2B": "SECOND BASEMAN",
      "SS": "SHORTSTOP",
      "3B": "THIRD BASEMAN",
      "C": "CATCHER",
      "LF": "LEFT FIELDER",
      "CF": "CENTER FIELDER",
      "RF": "RIGHT FIELDER",
      "DH": "DESIGNATED HITTER",
      "P": "PITCHER"
    };

    useEffect(() => {
      async function fetchData() {
          const res = await fetch('https://statsapi.mlb.com/api/v1/teams');
          if (!res.ok) {
              throw new Error('Failed to fetch data');
          }
          const data = await res.json();
          const currentMLBTeams = data.teams.filter(team => team.sport.id === 1);
  
          const rosterPromises = currentMLBTeams.map(team =>
              fetch(`https://statsapi.mlb.com/api/v1/teams/${team.id}/roster`).then(response => {
                  if (!response.ok) {
                      throw new Error(`Failed to fetch roster for team ${team.name}`);
                  }
                  return response.json();
              })
          );
  
          const players = [];
          const playersWithNames = [];
          const playersWithStats = [];
          const pitchers = [];
          const hitters = [];
  
          Promise.all(rosterPromises).then(rosters => {
              rosters.forEach((roster, index) => {
                  const team = currentMLBTeams[index];
                  roster.roster.forEach(player => {
                      const playerID = player.person.id;
                      players.push({
                          id: playerID,
                          name: `${player.person.fullName}`,
                          team: team.name,
                          teamAbr: team.abbreviation,
                          position: player.position.abbreviation,
                          link: player.person.link,
                          picture: 'assets/headshot.webp'
                      });
                  });
              });
  
              hitters.push(...players.filter(player => player.position !== "P"));
              pitchers.push(...players.filter(player => player.position === "P"));
  
              const fetchNextPitcherStats = async () => {
                  if (pitchers.length === 0) return;
                  const player = pitchers.shift();
  
                  try {
                      const response = await fetch(`https://statsapi.mlb.com/api/v1/people/${player.id}/stats?group=pitching&stats=season&season=2024`);
                      if (!response.ok) {
                          throw new Error(`Failed to fetch stats for ${player.name}`);
                      }
                      const pitcher = await response.json();
                      if (pitcher.stats[0] != null) {
                          playersWithStats.push({
                              id: player.id,
                              name: player.name,
                              team: player.team,
                              teamAbr: player.teamAbr,
                              position: player.position,
                              link: player.link,
                              picture: player.picture,
                              stats: `Innings Pitched: ${pitcher.stats[0].splits[0].stat.inningsPitched} Record: ${pitcher.stats[0].splits[0].stat.wins}-${pitcher.stats[0].splits[0].stat.losses} ERA: ${pitcher.stats[0].splits[0].stat.era} Saves: ${pitcher.stats[0].splits[0].stat.saves}`,
                              ip: pitcher.stats[0].splits[0].stat.inningsPitched,
                              record: `${pitcher.stats[0].splits[0].stat.wins}-${pitcher.stats[0].splits[0].stat.losses}`,
                              era: pitcher.stats[0].splits[0].stat.era,
                              saves: pitcher.stats[0].splits[0].stat.saves
                          });
                      }
                  } catch (error) {
                      console.error(`Failed to fetch stats for pitcher ${player.name}: ${error}`);
                  }
  
                  fetchNextPitcherStats();
              };
  
              const MAX_CONCURRENT_REQUESTS = 5;
              for (let i = 0; i < Math.min(MAX_CONCURRENT_REQUESTS, pitchers.length); i++) {
                  fetchNextPitcherStats();
              }
  
              // Fetch stats for hitters
              const hitterPromises = hitters.map(player =>
                  fetch(`https://statsapi.mlb.com/api/v1/people/${player.id}/stats?group=batting&stats=season&season=2024`).then(response => {
                      if (!response.ok) {
                          throw new Error(`Failed to fetch stats for ${player.name}`);
                      }
                      return response.json();
                  })
              );
  
              Promise.all(hitterPromises).then(players => {
                  players.forEach((hitter, index) => {
                      if (hitter.stats[0] != null) {
                          playersWithStats.push({
                              id: hitters[index].id,
                              name: hitters[index].name,
                              team: hitters[index].team,
                              teamAbr: hitters[index].teamAbr,
                              position: hitters[index].position,
                              link: hitters[index].link,
                              picture: hitters[index].picture,
                              stats: `AVG: ${hitter.stats[0].splits[0].stat.avg} OPS: ${hitter.stats[0].splits[0].stat.ops} RBIs: ${hitter.stats[0].splits[0].stat.rbi} HRs: ${hitter.stats[0].splits[0].stat.homeRuns}`,
                              avg: hitter.stats[0].splits[0].stat.avg,
                              ops: hitter.stats[0].splits[0].stat.ops,
                              rbi: hitter.stats[0].splits[0].stat.rbi,
                              hr: hitter.stats[0].splits[0].stat.homeRuns
                          });
                      }
                  });
              });
              
              setAllPlayers(playersWithStats);
          });
      }
  
      fetchData();
  }, []);
  

    const handlePositionClick = (position) => {
        setSelectedPlayerId(null);
        setSelectedPosition(position);
        const filteredPlayers = allPlayers.filter(player => player.position === position);
        setPlayersData(filteredPlayers);
        setOnPosition(true);
        setIsBlur(!isBlur);
        setIsOverlay(false);
        setPositionText(positionNames[position]);
    };

    const handleTeamSelect = (event) => {
        const team = event.target.value;
        setSelectedTeam(team);
        const filteredPlayers = allPlayers.filter(player => (selectedPosition === null || player.position === selectedPosition) && (team === "All" || player.teamAbr === team));
        setPlayersData(filteredPlayers);
    };

    const handlePlayerClick = (playerId, playerName) => {
      setSelectedPlayerId(playerId);
      setSelectedPlayerName(playerName);
    };

    const selectPlayer = (playerName, position) => {
      setSelectedTeam("All");
      setOnPosition(false);
      setIsOverlay(!isOverlay);
      setIsBlur(false);
      const updatedPositionSelectedName = { ...positionSelectedName };
      const newNumPlayersSelected = numPlayersSelected + 1;
      if (updatedPositionSelectedName[position] === "SELECT"){
        setNumPlayersSelected(newNumPlayersSelected);
      }
      updatedPositionSelectedName[position] = playerName;
      setPositionSelectedName(updatedPositionSelectedName);
    }

    const handleSubmit = () => {
      navigate('/AllStarSelect/FinishPage');
    }

  return (
    <div className='fieldContainer'>
      <div className={`leftSideBlack ${isBlur ? 'blur' : ''}`}>
        <div className='topLogos'>
          <div className='MLBLogo'></div>
          <div className='sponsorContainer'>
            <div className='poweredByText'>POWERED BY</div>
            <div className='sponsorLogo'></div>
          </div>
        </div>
        <div className='ultimateTeamLogo'></div>
        <div className='ultimateTeamText'>MLB</div>
        <div className='ultimateTeamText'>ULTIMATE</div>
        <div className='ultimateTeamText'>TEAM</div>
        <div className='instructionText'>Create your own MLB Ultimate Team. One lucky participant will win a VIP World Series experience!</div>
      </div>
      <div className={`grassContainer ${isOverlay ? 'overlay' : ''} ${isBlur ? 'blur' : ''}`}>
        <div className='baseballField'>
          <button className='addPlayerBox playerBox1B' onClick={() => handlePositionClick("1B")}>1B</button>
          <button className='addPlayerBox playerBox2B' onClick={() => handlePositionClick("2B")}>2B</button>
          <button className='addPlayerBox playerBoxSS' onClick={() => handlePositionClick("SS")}>SS</button>
          <button className='addPlayerBox playerBox3B' onClick={() => handlePositionClick("3B")}>3B</button>
          <button className='addPlayerBox playerBoxC' onClick={() => handlePositionClick("C")}>C</button>
          <button className='addPlayerBox playerBoxLF' onClick={() => handlePositionClick("LF")}>LF</button>
          <button className='addPlayerBox playerBoxCF' onClick={() => handlePositionClick("CF")}>CF</button>
          <button className='addPlayerBox playerBoxRF' onClick={() => handlePositionClick("RF")}>RF</button>
          <button className='addPlayerBox playerBoxDH' onClick={() => handlePositionClick("DH")}>DH</button>
          <button className='addPlayerBox playerBoxP' onClick={() => handlePositionClick("P")}>P</button>
          <div className='playerBoxText text1B'>{positionSelectedName["1B"]}</div>
          <div className='playerBoxText text2B'>{positionSelectedName["2B"]}</div>
          <div className='playerBoxText textSS'>{positionSelectedName["SS"]}</div>
          <div className='playerBoxText text3B'>{positionSelectedName["3B"]}</div>
          <div className='playerBoxText textC'>{positionSelectedName["C"]}</div>
          <div className='playerBoxText textLF'>{positionSelectedName["LF"]}</div>
          <div className='playerBoxText textCF'>{positionSelectedName["CF"]}</div>
          <div className='playerBoxText textRF'>{positionSelectedName["RF"]}</div>
          <div className='playerBoxText textDH'>{positionSelectedName["DH"]}</div>
          <div className='playerBoxText textP'>{positionSelectedName["P"]}</div>
        </div>
        {(numPlayersSelected !== 10) && <div className='selectYourPlayersText'>SELECT YOUR PLAYERS</div>}
        {(numPlayersSelected === 10) && <button className="selectPlayerButton" onClick={() => handleSubmit()}>SUBMIT</button>}
      </div>
      {/* Select Page */}
      {(onPosition) && (
        <div className="selectPage">
            <div className="filteringSection">
                <div className='selectText'>SELECT</div>
                <div className='positionText'>{positionText}</div>
                <div className='numberChosenText'>0</div>
                <div className='numberTotalText'>/1</div>
                {/* <select onChange={handleTeamSelect} value={selectedTeam}>
                    <option value="All">All</option>
                    <option value="AZ">Arizona Diamondbacks</option>
                    <option value="ATL">Atlanta Braves</option>
                    <option value="BAL">Baltimore Orioles</option>
                    <option value="BOS">Boston Red Sox</option>
                    <option value="CHC">Chicago Cubs</option>
                    <option value="CWS">Chicago White Sox</option>
                    <option value="CIN">Cincinnati Reds</option>
                    <option value="CLE">Cleveland Guardians</option>
                    <option value="COL">Colorado Rockies</option>
                    <option value="DET">Detriot Tigers</option>
                    <option value="HOU">Houston Astros</option>
                    <option value="KC">Kansas City Royals</option>
                    <option value="LAA">Los Angeles Angels</option>
                    <option value="LAD">Los Angeles Dodgers</option>
                    <option value="MIA">Miami Marlins</option>
                    <option value="MIL">Milwaukee Brewers</option>
                    <option value="MIN">Minnesota Twins</option>
                    <option value="NYM">New York Mets</option>
                    <option value="NYY">New York Yankees</option>
                    <option value="OAK">Oakland Athletics</option>
                    <option value="PHP">Philadelphia Phillies</option>
                    <option value="PIT">Pittsburgh Pirates</option>
                    <option value="SD">San Diego Padres</option>
                    <option value="SF">San Francisco Giants</option>
                    <option value="SEA">Seattle Mariners</option>
                    <option value="STL">St. Louis Cardinals</option>
                    <option value="TB">Tampa Bay Rays</option>
                    <option value="TEX">Texas Rangers</option>
                    <option value="TOR">Toronto Blue Jays</option>
                    <option value="WSH">Washington Nationals</option>
                </select> */}
            </div>
            <div className="scrollableSection">
                {playersData.map((player, index) => (
                  <div key={index} className={`player ${selectedPlayerId !== null && selectedPlayerId === player.id ? 'selected' : ''} ${selectedPlayerId !== null && selectedPlayerId !== player.id ? 'unselected' : ''}`} onClick={() => handlePlayerClick(player.id, player.name)}>
                      <div className='playerPicture'></div>
                      <div className='playerInfo'>
                        <div className='playerName'>{player.name}</div>
                        <div className='playerStats'>
                        {(selectedPosition !== "P") && (
                          <div>
                            <div>AVG: {player.avg}</div>
                            <div>OPS: {player.ops}</div>
                            <div>RBIs: {player.rbi}</div>
                            <div>HRs: {player.hr}</div>
                          </div>
                        )} 
                        {(selectedPosition === "P") && (
                          <div>
                            <div>IP: {player.ip}</div>
                            <div>Record: {player.record}</div>
                            <div>ERA: {player.era}</div>
                            <div>Saves: {player.saves}</div>
                          </div>
                        )} 
                        </div>
                      </div>
                  </div>
                ))}
            </div>
            {selectedPlayerId !== null && (
              <div className='selectPlayerButtonBackground'>
                <button className="selectPlayerButton" onClick={() => selectPlayer(selectedPlayerName, selectedPosition)}>SUBMIT</button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default PlayerSelectPage;
