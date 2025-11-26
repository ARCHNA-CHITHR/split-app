import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateSplit from './components/CreateSplit';

export const auth = {
  user: null,

  setUser: function (u) {
    this.user = u;
    localStorage.setItem("loggedUser", JSON.stringify(u));
  },

  getUser: function () {
    return JSON.parse(localStorage.getItem("loggedUser"));
  },

  logout: function () {
    this.user = null;
    localStorage.removeItem("loggedUser");
  }
};

function App() {
  const [user, setUserState] = useState(auth.getUser());

  auth.setUser = (u) => {
    auth.user = u;
    setUserState(u);
    localStorage.setItem("loggedUser", JSON.stringify(u));
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard user={user} />} />
      <Route path="/create-split" element={<CreateSplit user={user} />} />
    </Routes>
  );
}

export default App;
