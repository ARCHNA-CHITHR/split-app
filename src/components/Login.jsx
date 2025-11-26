import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../App";

// USERS list with usernames and string passwords
const USERS = [
  { id: 1, username: "leanne", name: "Leanne Graham", password: "12345" },
  { id: 2, username: "martin", name: "Martin Lucas", password: "12345" },
  { id: 3, username: "jason", name: "Jason Bright", password: "12345" },
  { id: 4, username: "sam", name: "Sam Wills", password: "12345" },
  { id: 5, username: "john", name: "John Lucas", password: "12345" }
];

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const login = (e) => {
    e.preventDefault();

    const found = USERS.find(
      (u) =>
        u.username.toLowerCase() === form.username.toLowerCase().trim() &&
        u.password === form.password
    );

    if (!found) return alert("Invalid credentials");

    auth.setUser(found); // Save user
    nav("/dashboard");   // Navigate to dashboard
  };

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "lightblue",
    },
    card: {
      background: "#fff",
      padding: "40px",
      width: "350px",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "15px",
    },
    button: {
      width: "50%",
      padding: "12px",
      background: "blue",
      color: "#fff",
      border: "none",
      fontSize: "16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
     <div style={styles.container} >
      <div style={styles.card}>
        
        <h2 className="text-center mb-3" style={{color:"blue"}}>Login</h2>
        <form onSubmit={login}>
          <div className="mb-3">
           
            <input  style={styles.input}
              className="form-control"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

         

          <div className="mb-3">
            
            <input style={styles.input}
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          
          <button   className="btn btn-primary w-100" style={styles.button} >Login</button>
          <div>
            <h5 style={{color:"blue"}}>Forgot password?</h5>
          </div>
        </form>
      </div>
    </div>
  );
}
