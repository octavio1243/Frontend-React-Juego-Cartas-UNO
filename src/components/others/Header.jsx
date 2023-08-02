import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './Header.css';

import cookies, { removeCookie } from '../../cookies';
import apiDomain from '../../config';

function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});

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
    const intervalId = setInterval(() => {
      if (cookies.get("token")) {
        fetchUserInfo();
      }
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-9">
            <nav className="navbar navbar-expand-lg navbar-light">
              <a className="navbar-brand text-white" href="/home">
                <img
                  src={apiDomain+"images/logo.png"}
                  alt="Logo"
                  className="logo-image"
                />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                {
                cookies.get("token")?
                  <div className="navbar-nav">
                    <a className="nav-link text-white" href="/create_game">Crear partida</a>
                    <a className="nav-link text-white" href="/join_game">Unirse partida</a>
                    <a className="nav-link text-white" href="/my_games">Mis partidas</a>
                  </div>
                :
                  <div className="navbar-nav">
                    <a className="nav-link text-white" href="/login">Iniciar sesión</a>
                    <a className="nav-link text-white" href="/register">Crear cuenta</a>
                  </div>
                }
              </div>
            </nav>
          </div>
          {
          cookies.get("token")?
          <div className="col-3 d-flex flex-column align-items-center">
            <div className="dropdown">
              <img
                src={userInfo.image_url}
                alt="Foto de perfil"
                className="profile-image"
                data-toggle="dropdown"
              />
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" href="/profile">Editar perfil</a>
                <a className="dropdown-item" href="/password">Cambiar contraseña</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" onClick={() => { removeCookie(); navigate('/'); }}>Cerrar sesión</a>
              </div>
            </div>
            <span className="text-white">{userInfo.name}</span>
          </div>
          :<div></div>}
        </div>
      </div>
    </header>
  )
}

export default Header