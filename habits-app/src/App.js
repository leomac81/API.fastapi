// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LoginForm';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Additional routes here */}
      </Routes>
  );
}

export default App;
