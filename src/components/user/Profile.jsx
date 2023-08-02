import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './Profile.css';
import Header from '../others/Header'
import InputForm from '../others/InputForm';

import cookies, { removeCookie } from '../../cookies';
import apiDomain from '../../config';

import Warning from '../others/Warning';
import Error from '../others/Error';
import Success from '../others/Success';

function Profile() {
    const navigate = useNavigate();
    const [warningMessage, setWarningMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setsuccessMessage] = useState('');

    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        image_url: '',
      });
   
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(apiDomain + 'v1/users/' + cookies.get("id"), {
          headers: {
            'Authorization': `${cookies.get("token")}`,
          },
        });
  
        if (response.status === 200) {
          setUserInfo({
            name: response.data.name,
            email: response.data.email,
            image_url: response.data.image_url,
          });
        }
      } catch (error) {
        console.error("Error al obtener información del usuario");
      }
    };
  
    useEffect(() => {
      if (cookies.get("token")) {
        fetchUserInfo();
      }
      else{
        navigate('/login');
      }
    }, []);
  
    const handleImageChange = (event) => {
        setWarningMessage('');
        setErrorMessage('');
        setsuccessMessage('');

        const file = event.target.files[0];
        if (file) {
          if (file.type === 'image/jpeg') {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result.split(',')[1];
              localStorage.setItem('imageData', base64String);
              setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                image_url: reader.result,
              }));
            };
            reader.readAsDataURL(file);
          } else {
            setWarningMessage('Por favor, selecciona una imagen en formato JPG.');
            event.target.value = '';
          }
        }
    };      

    const handleSaveChanges = async (event) => {
        setWarningMessage('');
        setErrorMessage('');
        setsuccessMessage('');

        event.preventDefault();
        const base64String = localStorage.getItem('imageData');
        console.log("base64String es "+base64String);
        if (base64String) {
            const requestData = {
                image: base64String
              };
            const requestBody = JSON.stringify(requestData);
            const response = await axios.post(apiDomain + 'v1/users/image', requestBody, {
                headers: {
                    'Authorization': cookies.get("token"),
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                fetchUserInfo();
                localStorage.removeItem('imageData');
                setsuccessMessage('Se ha actualizado la imagen de perfil');
            }
            else{
                setErrorMessage('Se ha producido un error al actualizar la imagen de perfil');
            }
        }
        else{
            setWarningMessage('No se han detectado cambios en la imagen de perfil');
        }
    };
    
    const deleteUser = async () => {
      try {
        const response = await axios.delete(apiDomain + 'v1/users/', {
          headers: {
            'Authorization': `${cookies.get("token")}`,
          },
        });
  
        if (response.status === 200) {
          removeCookie();
          navigate('/login');
        }
      } catch (error) {
        console.error("Error al obtener información del usuario");
      }
    };

    return (
    <div>
        <Header/>
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card shadow">
                    <div className="card-body">
                        <h2 className="text-center mb-4">Mi cuenta</h2>
                        <form>
                        <div className="form-group d-flex justify-content-center align-items-center">
                            <label htmlFor="fileInput">
                                <img
                                className="profile-pic mx-auto d-block rounded-circle mb-4"
                                src={userInfo.image_url}
                                alt="Foto de perfil"
                                />
                            </label>
                            <input type="file" id="fileInput" accept="image/jpeg" onChange={handleImageChange}/>
                        </div>
                        <InputForm 
                            type="text" 
                            id="name" 
                            description="Nombre de usuario" 
                            value={userInfo.name}
                            readOnly={true}
                        />
                        <InputForm 
                            type="email" 
                            id="email" 
                            description="Correo electrónico" 
                            value={userInfo.email}
                            readOnly={true}
                        />
                        <button type="submit" className="btn btn-primary btn-block" onClick={handleSaveChanges}>Guardar cambios</button>
                        <button type="button" className="btn btn-danger btn-block mt-2" onClick={deleteUser}>Borrar cuenta</button>
                        </form>
                        {warningMessage && <Warning description={warningMessage} />}
                        {errorMessage && <Error description={errorMessage} />}
                        {successMessage && <Success description={successMessage} />}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile