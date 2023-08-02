import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';

import Header from './../others/Header';
import Warning from '../others/Warning';
import Error from '../others/Error';
import Success from '../others/Success';

import cookies, { removeCookie } from './../../cookies';
import apiDomain from '../../config';


function Team() {
  const navigate = useNavigate();

  const { token } = useParams();

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [newTeamName, setNewTeamName] = useState('');

  const [warningMessage, setWarningMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setsuccessMessage] = useState('');

  const redirectToGame = () => {
    if (token) {
      navigate(`/game/${token}`);
    } else {
      console.error("No existe el token");
    }
    
  };

  /* LOGICA PARA LOS TEAMS */

  const fetchTeams = async () => {
    try {
      const response = await axios.get(apiDomain + 'v1/games/'+token+'/teams/', {
        headers: {
            'Authorization': cookies.get("token"),
            'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setTeams(response.data.teams);
      }
    } catch (error) {
      console.log("Error al obtener los equipos para una partida");
    }
  }

  const joinAsTeam = async (token,team_id) => {
    console.log("Unirse al team "+team_id+" en la partida "+token);
    try {
      const response = await axios.put(apiDomain + 'v1/games/'+token+'/teams/'+team_id, {}, {
        headers: {
            'Authorization': cookies.get("token"),
            'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        redirectToGame();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.messages) {
        const messageList = error.response.data.messages;
        const errorMessages = messageList.map(messageObj => messageObj.message);
        setErrorMessages(prevErrors => [...prevErrors, ...errorMessages.flat()]);
      }
    }
  };

  const handleTeamChange = (event) => {
    setWarningMessage("");
    setErrorMessages([]);
    setsuccessMessage("");

    setSelectedTeam(event.target.value);
  };

  const handleTeamSubmit = (event) => {
    event.preventDefault();
    setWarningMessage("");
    setErrorMessages([]);
    setsuccessMessage("");
    console.log("Unirse al equipo con ID:", selectedTeam);
    joinAsTeam(token,selectedTeam);
  };

  const handleNewTeamChange = (event) => {
    setWarningMessage("");
    setErrorMessages([]);
    setsuccessMessage("");

    setNewTeamName(event.target.value);
  };

  const handleNewTeamSubmit = async (event) => {
    event.preventDefault();
    setWarningMessage("");
    setErrorMessages([]);
    setsuccessMessage("");

    if (newTeamName==""){
      setErrorMessages(prevErrors => [...prevErrors, "El nombre del equipo no puede ser vacío"]);
      return;
    }
    const requestData = {
      team_name: newTeamName
    };
    const requestBody = JSON.stringify(requestData);
    try {
      const response = await axios.post(apiDomain + 'v1/games/'+token+'/teams/', requestBody, {
        headers: {
            'Authorization': cookies.get("token"),
            'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setsuccessMessage("Se ha creado el equipo exitosamente");
        setNewTeamName("");
        fetchTeams(token);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.messages) {
        const messageList = error.response.data.messages;
        const errorMessages = messageList.map(messageObj => messageObj.message);
        setErrorMessages(prevErrors => [...prevErrors, ...errorMessages.flat()]);
      }
    }
  };

  useEffect(() => {
    if (!cookies.get("token")) {
      navigate('/login');
    }
    console.log("Verificando");
    if(token){
      console.log("Buscando grupos...");
      fetchTeams();
    }
    else{
      navigate('/join_game');
    }
    

  }, []);

  return (
    <div>
      <Header/>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="text-center mb-4">Gestión de equipos</h2>
                
                <form onSubmit={handleTeamSubmit}>
                  <div className="form-group">
                    <label htmlFor="team">Equipo</label>
                    <select 
                      className="form-control" 
                      id="team" 
                      value={selectedTeam} 
                      onChange={handleTeamChange}
                      required
                    >
                      <option value="" disabled>Seleccionar equipo...</option>
                      {teams && teams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Unirse al equipo</button>
                </form>

                <hr/>
                
                <form onSubmit={handleNewTeamSubmit}>
                  <div className="form-group">
                    <label htmlFor="new-team">Crear un nuevo equipo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="new-team" 
                      placeholder="Ingrese el nombre del nuevo equipo"
                      value={newTeamName} 
                      onChange={handleNewTeamChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Crear equipo</button>
                </form>
                
                {warningMessage && <Warning description={warningMessage} />}
                {errorMessages.length > 0 && (
                  errorMessages.map((error, index) => (
                  <Error key={index} description={error} />
                  ))
                )}
                {successMessage && <Success description={successMessage} />}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Team