import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import StartPage from './StartPage/StartPage';
import FuelQuoteForm from './Components/FuelQuoteFormComponent';

function App() {

  return (
    // Router allows for client-side routing
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/"  element={<StartPage />} />
          <Route path="/fuel-quote" element={<FuelQuoteForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
