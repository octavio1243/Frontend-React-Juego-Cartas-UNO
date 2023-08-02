import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import InputForm from '../others/InputForm';
import Header from '../others/Header';
import Error from '../others/Error';

import cookies from './../../cookies';
import apiDomain from './../../config';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      navigate('/home');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    setErrors([]);
    if (formData.password === formData.confirm_password) {
      const requestData = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      };
      try {
        const requestBody = JSON.stringify(requestData);
        const response = await axios.post(apiDomain + 'v1/users/register', requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          cookies.set('id', response.data.id, { path: '/' });
          cookies.set('token', response.data.token, { path: '/' });
          navigate('/home');
        }
        
      } catch (error) {
        if (error.response && error.response.data && error.response.data.messages) {
          const messageList = error.response.data.messages;
          const errorMessages = messageList.map(messageObj => messageObj.message);
          console.log(errorMessages);
          setErrors(prevErrors => [...prevErrors, ...errorMessages.flat()]);
        } else {
          console.log('Ha ocurrido un error en la petición');
        }
      }
    } else {
      setErrors(prevErrors => [...prevErrors, 'Las contraseñas no coinciden']);
    }
    setIsSubmitting(false);
  };
  

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  return (!cookies.get("token")?(
    <div>
        <Header />
        <div className="container">
          <div className="row justify-content-center mt-5">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="text-center mb-4">Crear una cuenta</h2>
                  <form onSubmit={handleSubmit}>
                    <InputForm
                      id="username"
                      type="text"
                      placeholder="Ingrese su usuario"
                      description="Nombre de usuario"
                      value={formData.username}
                      onChange={handleChange}
                    />
                    <InputForm
                      id="email"
                      type="email"
                      placeholder="Ingrese su correo electrónico"
                      description="Correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <InputForm
                      id="password"
                      type="password"
                      placeholder="Ingrese su contraseña"
                      description="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <InputForm
                      id="confirm_password"
                      type="password"
                      placeholder="Confirme su contraseña"
                      description="Confirmar contraseña"
                      value={formData.confirm_password}
                      onChange={handleChange}
                    />
                    <button type="submit" className="btn btn-primary btn-block">
                      Registrarse
                    </button>
                  </form>
                  {
                    errors && errors.map((desc, index) => (
                      <Error key={index} description={desc} />
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  ):(<div>{navigate('/home')}</div>)
  );
}

export default Register;