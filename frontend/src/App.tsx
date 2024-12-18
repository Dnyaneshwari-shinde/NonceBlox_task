import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from "../src/components/Home";
import Dashboard from '../src/components/Dashborad';
import Register from "../src/components/Register";
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Home" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
