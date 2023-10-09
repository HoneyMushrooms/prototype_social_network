import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../login/Login';
import RegisterPage from '../register/Register';
import MainPage from '../main/Main';
import ForgotPassword from '../login/reset_passwords/ForgotPassword';
import ResetPassword from '../login/reset_passwords/ResetPassword';
import { useState } from 'react';

function App() {
    const [firstConnect, setFirstConnect] = useState(false);

    return (
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/register" element={<RegisterPage setFirstConnect={setFirstConnect}/>} />
            <Route path="/main" element={<MainPage firstConnect={firstConnect} setFirstConnect={setFirstConnect}/>} />
            <Route path="/fogot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:link" element={<ResetPassword />} />
        </Routes>
        </BrowserRouter>
    );
}

export default App;