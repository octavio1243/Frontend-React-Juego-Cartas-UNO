# Juego de cartas UNO (Frontend en React)

Se recreo el juego de cartas UNO. Sus características son:
- Creación e inicio de sesión para usuarios
- Creacion de partidas en modalidad grupal e individual (generación de token)
- Buscar partidas dado su token
- Crear y unirse a grupos de modalidad grupal
- Gestionar información del usuario (foto de perfil y cambiar su contraseña) y para borrar cuenta
- En cada partida se pueden tomar cartas del mazo, tirar cartas propias, ver cartas propias y su cantidad. Además, se puede ver el nombre , la foto de perfil y la cantidad de cartas de los otros jugadores de la partida
- Llevar registro de los puntajes de los jugadores o grupos

## ¿Cómo ejecutar?

1) Descargar y descomprimir
2) Ejecutar "npm install" sobre el directorio descomprimido
3) Ejecutar servidor con "npm start"
   
Importante: En el puerto 3000 escucha a la API del backend (se puede cambiar en el /src/config.js)

## Capturas de pantalla:
### Pantalla para registrarse
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/0-registrarse.jpeg)
### Pantalla para iniciar sesión
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/1-loguearse.jpeg)
### Pantalla para ver detalles de mi cuenta y/o borrar cuenta
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/2-mi_cuenta.jpeg)
### Pantalla para cambiar contraseña
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/3-cambiar_contrase%C3%B1a.jpeg)
### Pantalla para crear una partida
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/4-crear_partida.jpeg)
### Pantalla para unirse a una partida
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/5-unirse_partida.jpeg)
### Pantalla para ver partidas del usuario
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/6-partidas_usuario.jpeg)
### Pantalla para jugar la partida
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/7-panel_juego.jpeg)
### Pantalla popup para ver los puntajes
![](https://raw.githubusercontent.com/octavio1243/Frontend-React-Juego-Cartas-UNO/main/capturas/8-puntaje_jugadores.jpeg)

## Mejoras futuras
- [ ] Mejorar el performance de las peticiones realizadas a los endpoints
- [ ] Agregar captcha para el registro
- [ ] Agregar confirmación de correo electrónico
- [ ] Hacerlo responsive para dispositivos móviles

## Contacto
Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto mediate octavioalcalde1@gmail.com

