import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateSplit from './components/CreateSplit';


export const auth = {
getUser: () => JSON.parse(localStorage.getItem('ss_user') || 'null'),
setUser: (u) => localStorage.setItem('ss_user', JSON.stringify(u)),
logout: () => localStorage.removeItem('ss_user')
};


export default function App() {
const user = auth.getUser();
return (
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
<Route path="/create" element={user ? <CreateSplit /> : <Navigate to="/login" />} />
<Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
</Routes>
);
}