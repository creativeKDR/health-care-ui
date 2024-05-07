
import './App.css';
import { Route,Routes } from 'react-router-dom';
import Login from './pages/home/login.tsx';
import Dashboard from './pages/dashboard/dashboard.tsx';
import React from 'react';
import HealthData from './pages/health-data/health-data.tsx';
import ProfileForm from './pages/profile/profile.tsx';
import RegisterForm from './pages/register/register.tsx';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/health-data" element={<HealthData/>}/>
        <Route path="/profile" element={<ProfileForm/>}/>
      </Routes>
    </div>
  );
}

export default App;
