import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from './../others/Header';

import cookies, { removeCookie } from './../../cookies';
import apiDomain from '../../config';

import './Games.css';

function Games() {
  const navigate = useNavigate();
  const [myGames, setMyGames] = useState([]);
  const [otherGames, setOtherGames] = useState([]);

  const fetchUserInfo = async (user_id) => {
    let username = "";
    try {
      const response = await axios.get(apiDomain + 'v1/users/'+user_id, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });

      if (response.status === 200) {
        username = response.data.name;
      }
    } catch (error) {
      console.error("Error al obtener información del usuario");
    }
    return username;
  };

  const fetchGameInfo = async (game_token) => {
    let newGame = {};
    try {
      const response = await axios.get(apiDomain + 'v1/games/'+game_token, {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });

      if (response.status === 200) {
        let json_data = response.data
        const username = await fetchUserInfo(json_data.administrator_id);

        newGame= {
          modality: json_data.max_groups>0? "Grupal":"Individual",
          administrator: username,
          status: json_data.finished? "Finalizado":"En curso",
          token: game_token,
          action: json_data.finished?"-":(json_data.joined?"Reanudar":"Unirse")
        };
        console.log(newGame);
      }
    } catch (error) {
      console.error("Error al obtener información de la partida");
    }
    return newGame;
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get(apiDomain + 'v1/games', {
        headers: {
          'Authorization': `${cookies.get("token")}`,
        },
      });
  
      if (response.status === 200) {
        const myGamesPromises = response.data.my_games.map((game) => fetchGameInfo(game.game_token));
        const otherGamesPromises = response.data.other_games.map((game) => fetchGameInfo(game.game_token));
        
        const myGamesData = await Promise.all(myGamesPromises);
        const otherGamesData = await Promise.all(otherGamesPromises);
  
        setMyGames(myGamesData);
        setOtherGames(otherGamesData);
      }
    } catch (error) {
      console.error("Error al obtener las partidas del usuario");
    }
  };
  
  const redirectToGame = (token) => {
    if (token) {
      navigate(`/game/${token}`);
    } else {
      console.error("No existe el token");
    }
  };

  const joinAsUser = async (token) => {
    try {
      const response = await axios.post(apiDomain + 'v1/games/'+token+'/users/', {}, {
        headers: {
            'Authorization': cookies.get("token"),
            'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        redirectToGame(token);
      }
    } catch (error) {
    }
  };

  const handleSubmit = (game) => {
    console.log("Ejecutando accion");
    if (game.action === "-") {
      return;
    }
    if (game.action === "Reanudar") {
      navigate(`/game/${game.token}`);
    }
    if (game.action === "Unirse") {
      if (game.modality === "Grupal") {
        navigate(`/teams/${game.token}`);
      } 
      if (game.modality === "Individual") {
        joinAsUser(game.token);
      } 
    }
  };


  useEffect(() => {
    if (!cookies.get("token")) {
      navigate('/login');
    }
    
    const intervalId = setInterval(() => {
      fetchGames();
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };

  }, [myGames, otherGames]);

  return (
    <div>
      <Header/>
      <div className="container mt-5">
        <h2>Mis Partidas</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr id="cabecera" className="text-white">
                <th scope="col">Modalidad</th>
                <th scope="col">Creador</th>
                <th scope="col">Estado</th>
                <th scope="col">Token</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
            {
            myGames.map( (game) => (
              <tr key={game.token}>
                <td>{game.modality}</td>
                <td>{game.administrator}</td>
                <td>{game.status}</td>
                <td>{game.token}</td>
                <td>
                  <button onClick={() => handleSubmit(game)} className="btn btn-primary">{game.action}</button>
                </td>
              </tr>
            ))
            }
            </tbody>
          </table>
        </div>
        <h2>Otras Partidas</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr id="cabecera" className="text-white">
                <th scope="col">Modalidad</th>
                <th scope="col">Creador</th>
                <th scope="col">Estado</th>
                <th scope="col">Token</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
            {
            otherGames.map( (game) => (
              <tr key={game.token}>
                <td>{game.modality}</td>
                <td>{game.administrator}</td>
                <td>{game.status}</td>
                <td>{game.token}</td>
                <td>
                  <button onClick={() => handleSubmit(game)} className="btn btn-primary">{game.action}</button>
                </td>
              </tr>
            ))
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
  )
}

export default Games