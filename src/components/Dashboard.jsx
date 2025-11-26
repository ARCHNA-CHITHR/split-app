
/* FILE: src/components/Dashboard.jsx */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../App';

const USERS = [
  { id: 1, name: "Leanne Graham" },
  { id: 2, name: "Martin Lucas" },
  { id: 3, name: "Jason Bright" },
  { id: 4, name: "Sam Wills" },
  { id: 5, name: "John Lucas" }
];

const KEY = 'ss_splits';
function load() { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
function save(x) { localStorage.setItem(KEY, JSON.stringify(x)); }

export default function Dashboard() {
  const user = auth.getUser();
  const nav = useNavigate();
  const [splits, setSplits] = useState(load());
  const [tab, setTab] = useState('pay');

  useEffect(() => save(splits), [splits]);

  const toPay = useMemo(() => splits.filter(s => (s.participants[user.id] || 0) > (s.paid?.[user.id] || 0)), [splits]);
  const toReceive = useMemo(() => splits.filter(s => s.createdBy === user.id), [splits]);

  const pay = (id, amount) => {
    setSplits(prev => prev.map(s => {
      if (s.id !== id) return s;
      const already = s.paid?.[user.id] || 0;
      return { ...s, paid: { ...s.paid, [user.id]: Number(already) + Number(amount) } };
    }));
  };


   const styles = {
    container: {
      padding: "20px",
      minHeight: "100vh",
      background: "#f4f6f8",
       
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      
    },
    logoutBtn: {
      padding: "8px 16px",
      background:"#26c6da" ,
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
    },
    createBtn: {
      marginTop: "20px",
      padding: "10px 18px",
      background: "#26c6da",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      display: "inline-block",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <div >
        <h3>Dashboard</h3>
        <div style={styles.header}>
          <span className="me-3">Hello, <b>{user.name}</b></span>
          <button
   style={styles.logoutBtn}
  onClick={() => {
    auth.logout();
    nav('/');
  }}
>
  Logout
</button>

        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'pay' && 'active'}`} onClick={() => setTab('pay')}>Pending to Pay</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'receive' && 'active'}`} onClick={() => setTab('receive')}>Pending to Receive</button>
        </li>
      </ul>

      {tab === 'pay' && (
        <div>
          {toPay.length === 0 && <div className="alert alert-success">No pending payments</div>}
          {toPay.map(s => {
            const owed = (s.participants[user.id] || 0) - (s.paid?.[user.id] || 0);
            return (
              <div style={styles.card} key={s.id}>
                <h6>Split #{s.id}</h6>
                <p>You owe: ₹{owed.toFixed(2)}</p>
                <input id={`pay-₹{amount}
{s.id}`} className="form-control mb-2" placeholder="Amount" />
                <button className="btn btn-primary" onClick={() => {
                  const amt = document.getElementById(`pay-${s.id}`).value;
                  if (!amt) return alert('Enter amount');
                  pay(s.id, amt);
                }}>Pay</button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'receive' && (
        <div>
          {toReceive.length === 0 && <div className="alert alert-info">No splits created by you</div>}
          {toReceive.map(s => (
            <div style={styles.card} key={s.id}>
              <h6>Split #{s.id}</h6>
              <p>Total: ₹{Object.values(s.participants).reduce((a,b)=>a+b,0)}</p>
              <ul>
                {Object.entries(s.participants).map(([uid, amt]) => (
                  <li key={uid}>{USERS.find(u=>u.id==uid)?.name}: ₹{amt} — Paid: ₹{s.paid?.[uid]||0}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

     <Link to="/create-split" style={styles.createBtn}>Create New Split</Link>

    </div>
  );
}

