import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import cookies, { removeCookie } from '../../cookies';
import apiDomain from '../../config';

import Header from './../others/Header';
import Warning from '../others/Warning';
import Error from '../others/Error';
import Success from '../others/Success';

function Create() {
    const navigate = useNavigate();
    const [groupCount, setGroupCount] = useState(0); // 0 es individual, 1 es en grupo pero sin definir cantidad de grupos
    const [warningMessage, setWarningMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const [successMessage, setsuccessMessage] = useState('');

    const handleGroupCountChange = (event) => {
        setWarningMessage("");
        setErrorMessages([]);
        setsuccessMessage("");
        setGroupCount(Number(event.target.value));
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setWarningMessage("");
        setErrorMessages([]);
        setsuccessMessage("");

        if (groupCount==1){
            console.log('ERROR Cant. grupos:', groupCount);
            setErrorMessages((prevErrors) => [...prevErrors, 'Debe seleccionar la cantidad de grupos']);
            return;
        }
        const requestData = {
            max_groups: groupCount
          };
        const requestBody = JSON.stringify(requestData);
        
        try {
            const response = await axios.post(apiDomain + 'v1/games', requestBody, {
                headers: {
                    'Authorization': cookies.get("token"),
                    'Content-Type': 'application/json'
                }
            });    
            if (response.status === 200) {
                const gameToken = response.data.game_token;
                setsuccessMessage("Partida creada correctamente. Token: "+gameToken);
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
      }, []);

    return (
    <div>
        <Header/>
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Crear partida</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="mode">Modalidad</label>
                                    <select 
                                    className="form-control" 
                                    id="mode" 
                                    value={groupCount > 0 ? "1" : "0"} // Establece el valor de acuerdo a groupCount
                                    onChange={handleGroupCountChange}
                                    >
                                        <option value="0">Individual</option>
                                        <option value="1">Grupos</option>
                                    </select>
                                </div>
                                {groupCount>0 && (
                                <div className="form-group" id="groupSizeInput">
                                    <label>Cantidad de grupos</label>
                                    <div className="btn-group d-flex" data-toggle="buttons">
                                        <label className={`btn btn-outline-primary flex-fill ${groupCount === 2 ? 'active' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="group-count" 
                                                id="group-count-2" 
                                                value="2"
                                                onClick={handleGroupCountChange}
                                            /> 2
                                        </label>
                                        <label className={`btn btn-outline-primary flex-fill ${groupCount === 4 ? 'active' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="group-count" 
                                                id="group-count-4" 
                                                value="4" 
                                                onClick={handleGroupCountChange}
                                            /> 4
                                        </label>
                                        <label className={`btn btn-outline-primary flex-fill ${groupCount === 6 ? 'active' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="group-count" 
                                                id="group-count-6" 
                                                value="6" 
                                                onClick={handleGroupCountChange}
                                            /> 6
                                        </label>
                                    </div>
                                </div>
                                )}
                                <button type="submit" className="btn btn-primary btn-block">Crear partida</button>
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

export default Create