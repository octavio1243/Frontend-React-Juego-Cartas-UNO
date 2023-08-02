import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';

import './PlayerList.css';

import apiDomain from '../../config';
import cookies from '../../cookies';

function PlayerList(props) {
  const [visiblePlayers, setVisiblePlayers] = useState([0, 1, 2, 3]);
  const [numPlayer, setNumPlayers] = useState(props.players.length);
  const navigate = useNavigate();

  const handlePrevClick = () => {
    let newIndexes = visiblePlayers.map((_, index) => {
      return (visiblePlayers[index]+1)%props.players.length;
    });
    if (newIndexes.length !== new Set(newIndexes).size) {
      newIndexes=[0, 1, 2, 3];
    }
    console.log(newIndexes);
    setVisiblePlayers(newIndexes);
  };

  const handleNextClick = () => {
    let newIndexes = visiblePlayers.map((_, index) => {
      if ((visiblePlayers[index]-1)>=0){
        return visiblePlayers[index]-1;
      }
      return props.players.length-1;
    });
    if (newIndexes.length !== new Set(newIndexes).size) {
      newIndexes=[0, 1, 2, 3];
    }
    console.log(newIndexes);
    setVisiblePlayers(newIndexes);
  };

  useEffect(() => {
    if (!cookies.get("token")) {
      navigate('/login');
    }
    
    let newIndexes;
    if (numPlayer>props.players.length){
      newIndexes = visiblePlayers.map((value,index) => {
        let newValue = value - 1;
        return newValue;
      });
      setVisiblePlayers(newIndexes);
    }
    else if (numPlayer<props.players.length){
      newIndexes = visiblePlayers.map((value,index) => {
        let newValue = props.players.length-4+index;
        return newValue;
      });
      setVisiblePlayers(newIndexes);
    }

    if (visiblePlayers.some(value => value < 0)){
      setVisiblePlayers([0, 1, 2, 3]);
    }
    setNumPlayers(props.players.length);
    
  }, [props.players]);

  return (
    <div>
      
      <div className="button-container d-flex justify-content-center align-items-center">
        <button className="player-list-button prev" id="prevPlayerButton" onClick={handlePrevClick}>
          <i className="fas fa-chevron-up"></i>
        </button>
      </div>

      <div className="player-list-container justify-content-center align-items-center" style={{ height: "48vh", flexDirection: "column" }}>
        <ul className="player-list" id="playerList">
          {
          visiblePlayers.map((indexPlayer, index) => (
            <div className="mb-3 mt-3" key={indexPlayer}>
              {props.players[indexPlayer] && (
              <div>
                <li className="player-item">
                  <div className="player-info">
                    <img
                      src={props.players[indexPlayer].url}
                      alt={`Avatar jugador ${indexPlayer}`}
                    />
                    <span className="card-count">{props.players[indexPlayer].amountCards}</span>
                  </div>
                  <span className="player-name">{props.players[indexPlayer].name}</span>
                </li>
                <hr />
              </div>
              )}
              
            </div>
          ))
          }
        </ul>
      </div>

      <div className="button-container d-flex justify-content-center align-items-center">
        <button className="player-list-button next" id="nextPlayerButton" onClick={handleNextClick}>
          <i className="fas fa-chevron-down"></i>
        </button>
      </div>

    </div>
  );
}

export default PlayerList