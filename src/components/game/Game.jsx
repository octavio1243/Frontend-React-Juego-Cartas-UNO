import React, { useState, useRef, useEffect } from 'react';
import Header from '../others/Header';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';

import ListCards from './ListCards';
import PlayerList from './PlayerList';
import apiDomain from '../../config';
import cookies from './../../cookies';
import Scores from './Scores';
import './Game.css';
import Warning from '../others/Warning';

function Game() {
  const { token } = useParams();
  const [myCards, setMyCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [lastCard, setLastCard] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [gameInfo, setGameInfo] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const navigate = useNavigate();
  
  const fetchMyCards = async () => {
    try {
      const response = await axios.get(apiDomain + 'v1/games/'+token+'/cards/'+ cookies.get("id"), {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });

      if (response.status === 200) {
        setMyCards(response.data.cards);
      }
    } catch (error) {
      console.error("Error al obtener información del usuario");
    }
  };

  const getPlayerInfo = async (userID) => {
    try {
      const response = await axios.get(apiDomain + 'v1/users/'+userID, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error al obtener información del usuario");
    }
  };

  const getPlayerCards = async (userID) => {
    try {
      const response = await axios.get(apiDomain + 'v1/games/'+token+'/cards/'+userID, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error al obtener información del usuario");
    }
  };

  const getGameInfo = async () => {
    try {
      const response = await axios.get(apiDomain + 'v1/games/'+token, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        setGameInfo(response.data);
        if (response.data.finished){
          setWarningMessage("La partida ha finalizado");
        }
      }
    } catch (error) {
      console.error("Error al obtener puntaje del usuario");
    }
  }; 

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(apiDomain + 'v1/games/'+token+'/users', {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        return response.data.users;
      }
    } catch (error) {
      console.error("Error al obtener información del usuario");
    }
  };

  const getGamePlayers = async () => {
    try {
      const playersData = await fetchPlayers();
      const playersPromises = playersData.map(async (player) => {
        if (player.id != cookies.get("id")) {
          const playerInfo = await getPlayerInfo(player.id);
          const playerCards = await getPlayerCards(player.id);
          
          return {
            id: player.id,
            team: player.team,
            name: playerInfo.name,
            url: playerInfo.image_url,
            amountCards: playerCards.amount_cards,
            cards: playerCards.cards
          };
        }
      });
      const players = await Promise.all(playersPromises);
      const validPlayers = players.filter(player => player !== undefined);
      setPlayers(validPlayers);
    } catch (error) {
      console.error("Error al obtener información de los jugadores", error);
    }
  };

  const takeCard = async () => {
    try {
      const response = await axios.post(apiDomain + 'v1/games/'+token+'/cards', {}, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        setMyCards([...myCards, response.data]);
      }
    } catch (error) {
      console.error("Error al obtener carta del mazo");
    }
  };

  const throwCard = async (cardID) => {
    try {
      const response = await axios.put(apiDomain + 'v1/games/'+token+'/cards/'+cardID, {}, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        setMyCards(prevMyCards => prevMyCards.filter(card => card.id != cardID));
      }
    } catch (error) {
      console.error("Error al tirar carta");
    }
  };

  const getLastCard = async () => {
    try {
      const response = await axios.get(apiDomain + 'v1/games/'+token+'/card', {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        setLastCard(response.data.url);
      }
    } catch (error) {
      console.error("Error al obtener ultima carta");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Control') {
      setShowPopup(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Control') {
      setShowPopup(false);
    }
  };

  const finishGame = async () => {
    try {
      const response = await axios.put(apiDomain + 'v1/games/'+token,{}, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        console.log("Partida finalizada");
      }
    } catch (error) {
      console.error("Error al obtener ultima carta");
    }
  };

  const resetGame = async () => {
    try {
      const response = await axios.put(apiDomain + 'v1/games/'+token+'/cards',{}, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
      if (response.status === 200) {
        console.log("Cartas cambiadas correctamente");
      }
    } catch (error) {
      console.error("Error al restablecer la partida");
    }
  };


  useEffect(() => {
    if (!cookies.get("token")) {
      navigate('/login');
    }
    const intervalId = setInterval(() => {
      fetchMyCards();
      getGameInfo();
      getLastCard();
      getGamePlayers();
    }, 1000);

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(intervalId);
    };

  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row no-gutters">
          <div className="col-9 game-container">
            
            <div className="player-card-count">{myCards.length} cartas</div> 
            
            <div className="row">
              <div className="col">
                <div
                  className="card-on-table"
                  id="cartas-mesa"
                >
                  <img
                    src={lastCard && apiDomain+lastCard}
                    alt="Carta en la mesa"
                    id="carta-mesa"
                  />
                  <img
                    src={apiDomain+"images/cards/back.png"}
                    alt="Carta en la mesa"
                    id="carta-mesa"
                    onClick={takeCard}
                  />
                </div>
              </div>
            </div>
            <hr />

            <div className="row">
              <div className="col">
                <ListCards myCards={myCards} throwCard={throwCard}/>
              </div>
            </div>
          </div>

          <div className="col-2 game-container">
            <PlayerList players={players} />            
          </div>
        </div>

        {cookies.get("id")==gameInfo.administrator_id?
        <div className="row no-gutters">
          <div className="col-9 d-flex justify-content-center mt-3">
            <button className="btn btn-success mr-4" id="botones-partida" onClick={resetGame}>
              Restablecer partida
            </button>
            <button className="btn btn-danger" id="botones-partida" onClick={finishGame}>
              Terminar partida
            </button>
          </div>
        </div>
        :""
        }

        <div className="row no-gutters">
          <div className="col-9 d-flex justify-content-center">
            {warningMessage && <Warning description={warningMessage} />}
          </div>
        </div>
        
      </div>
      {showPopup && <Scores gameInfo={gameInfo} token={token} />}
    </div>
  );
}

export default Game