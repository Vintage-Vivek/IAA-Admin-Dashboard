
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import QueryForm from './pages/QueryForm';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={
          loggedIn ? <AdminDashboard onLogout={() => setLoggedIn(false)} /> : <Login onLogin={() => setLoggedIn(true)} />
        } />
        <Route path="/*" element={<QueryForm />} />
      </Routes>
    </Router>
  );
}

export default App;
