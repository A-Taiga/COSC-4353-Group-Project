import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StartPage.css';
// import FingerprintJS from "@fingerprintjs/fingerprintjs"
  
  const StartPage: React.FC = () => {
    const navigate = useNavigate();

    return (
    <div className="start-page">
      <section className="about">
        <h1>ABOUT FUEL RATE PREDICTOR</h1>
        <p>
          Create, Manage, and View your fuel quotes all in one place!
        </p>
        <button className="get-started"onClick={() => navigate('/login')}>get started</button>
      </section>
      <section className="acronym">
        <div className="highlight">
          <h2><strong>E</strong>fficient</h2>
          <p>Tired of waiting? Wait no more!</p>
        </div>
        <div className="highlight">
          <h2><strong>A</strong>ccessible</h2>
          <p>Access on any device, input the numbers and be done!</p>
        </div>
        <div className="highlight">
          <h2><strong>S</strong>ecure</h2>
          <p>We keep your files safe!</p>
        </div>
        <div className="highlight">
          <h2><strong>Y</strong>ield</h2>
          <p>Offering the best fuel quotes and return for you!</p>
        </div>
      </section>
    </div>
  );
};

export default StartPage;
