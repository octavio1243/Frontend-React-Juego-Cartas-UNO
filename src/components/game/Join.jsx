import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';

import Header from './../others/Header';
import Warning from '../others/Warning';
import Error from '../others/Error';
import Success from '../others/Success';

import cookies, { removeCookie } from './../../cookies';
import apiDomain from '../../config';


function Join() {
  const navigate = useNavigate();

  const [token, setToken] = useState('');

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

  const redirectToTeams = () => {
    if (token) {
      navigate(`/teams/${token}`);
    } else {
      console.error("No existe el token");
    }
    
  };

  /* LOGICA PARA VERIFICAR PARTIDA Y UNIRSE A LA INDIVIDUAL*/

  const joinAsUser = async (token) => {
    try {
      const response = await axios.post(apiDomain + 'v1/games/'+token+'/users/', {}, {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setWarningMessage("");
    setErrorMessages([]);
    setsuccessMessage("");

    if (token==""){
      setErrorMessages(prevErrors => [...prevErrors, "El token no puede ser vacío"]);
      return
    }

    try {
        const response = await axios.get(apiDomain + 'v1/games/'+token, {
            headers: {
                'Authorization': cookies.get("token"),
                'Content-Type': 'application/json'
            }
        });    
        if (response.status === 200) {
          if (response.data.finished){
            setErrorMessages(prevErrors => [...prevErrors, "La partida ha finalizado"]);
            console.error("La partida ya ha finalizado");
          }
          else if (response.data.joined){
            console.log("Ya estabas unido a la partida. Redireccionando");
            redirectToGame();
          }  
          else if (response.data.max_groups==0){
            console.log("Uniendo a partida individual");
            joinAsUser(token);
          }
          else{
            console.log("Redireccionando a grupos");
            redirectToTeams();
          }
            
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.messages) {
            const messageList = error.response.data.messages;
            const errorMessages = messageList.map(messageObj => messageObj.message);
            setErrorMessages(prevErrors => [...prevErrors, ...errorMessages.flat()]);
        }
    }
  };

  const handleTokenChange = (event) => {
    setWarningMessage("");
    setErrorMessages([]);
    setsuccessMessage("");
    setToken(event.target.value);
  };

  useEffect(() => {
    if (!cookies.get("token")) {
      navigate('/login');
    }
  }, []);

  return (
    <div>
      <Header/>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">Unirse a la partida</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="token">Token</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="token" 
                      placeholder="Ingrese el token de la partida"
                      value={token}
                      onChange={handleTokenChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Unirse</button>
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

export default Join