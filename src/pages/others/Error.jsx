import React, { useEffect } from 'react';
import homer from '../../assets/images/homer.png'
import rosquilla from '../../assets/images/rosquilla.png'
import '../../css/Error.css';

function Error() {
  useEffect(() => {
    const token = window.localStorage.getItem('tokenLoggedUser');
    if (!token) {
      window.location.href = '/';
    }

    const numRosquillas = 20;
    const rosquillaContainer = document.querySelector('.rainfall-container');

    for (let i = 0; i < numRosquillas; i++) {
      const rosquillaElement = document.createElement('img');
      rosquillaElement.src = rosquilla;
      rosquillaElement.alt = 'Rosquilla';
      rosquillaElement.classList.add('falling-item', 'rosquilla');
      rosquillaElement.style.width = '80px';
      rosquillaElement.style.height = 'auto';
      rosquillaContainer.appendChild(rosquillaElement);
    }

    const rosquillas = document.querySelectorAll('.rosquilla');
    rosquillas.forEach((rosquilla) => {
      const startX = Math.random() * window.innerWidth;
      const startY = -100;
      const startDelay = Math.random() * 2;
      const fallDuration = Math.random() * 6 + 2;

      rosquilla.style.left = `${startX}px`;
      rosquilla.style.top = `${startY}px`;
      rosquilla.style.animation = `fallAnimation ${fallDuration}s linear infinite ${startDelay}s`;
    });
  }, []);

  return (
    <div className="error-container">
      <div className="text-center">
        <h1><b>ERROR 404</b></h1>
        <h1>Oops, parece que te has perdido... La página que buscas no existe</h1>
      </div>
      <div className="error-svg-container">
        <img src={homer} alt="Homer Simpson" style={{ height: '400px', width: '350px' }} />
        <h5>Al igual que comerte todas estas rosquillas sin engordar... 🍩</h5>
        <h5>¿Qué tal si volvemos al inicio?</h5>
        <a href="/" className='btn btn-primary' style={{ color: "white", background: "purple" }}>Inicio</a>
      </div>
      <div className="rainfall-container">

      </div>
    </div>
  );
}

export default Error;
