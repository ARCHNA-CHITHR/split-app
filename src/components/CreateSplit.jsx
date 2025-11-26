import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function CreateSplit() {
  const nav = useNavigate();
  const me = auth.getUser();
  const [form, setForm] = useState({ users: [], type: 'equal', total: 0, amounts: {}, percentages: {} });
  
  const toggle = (id) => setForm(f => f.users.includes(id) ? {...f, users: f.users.filter(x=>x!==id)} : {...f, users: [...f.users,id]});

  const create = () => {
    if(!form.users.length) return alert('Select participants');
    if(!form.total) return alert('Enter total');
    let participants = {};

    if(form.type==='equal') {
      const per = form.total / form.users.length;
      form.users.forEach(u => participants[u] = Number(per.toFixed(2)));
    }

    if(form.type==='specific') {
      const sum = form.users.reduce((t,u)=>t + Number(form.amounts[u]||0),0);
      if(sum !== form.total) return alert('Specific amounts must match total');
      form.users.forEach(u => participants[u] = Number(form.amounts[u]||0));
    }

    if(form.type==='percentage') {
      const sum = form.users.reduce((t,u)=>t + Number(form.percentages[u]||0),0);
      if(sum!==100) return alert('Percent must be 100');
      form.users.forEach(u => participants[u] = Number(((form.total*form.percentages[u])/100).toFixed(2)));
    }

    const all = load();
    all.push({id: Date.now(), createdBy: me.id, participants, paid:{}});
    save(all);
    alert('Split created');
    nav('/dashboard');
  };

  const styles = {
    container: {
      padding: "30px",
      background: "#e0f7fa",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      background: "#fff",
      padding: "30px",
      width: "450px",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    textArea: {
      width: "100%",
      padding: "12px",
      height: "50px",
      borderRadius: "8px",
      marginBottom: "12px",
      border: "1px solid #ccc",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "#26c6da",
      color: "white",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "10px",
    },
    closeBtn: {
      marginTop: "15px",
      padding: "10px",
      width: "100%",
      background: "#ff6b6b",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };

  return (
     <div style={styles.container}>
      <div style={styles.card}>
        <h3>Create Split</h3>    
        <label className="form-label mt-2">Participants</label>
        <div style={styles.input}>
          {USERS.map(u=>(
            <div className="col-4 form-check" key={u.id}>
              <input type="checkbox" className="form-check-input" checked={form.users.includes(u.id)} onChange={()=>toggle(u.id)} />
              <label>{u.name}</label>
            </div>
          ))}
        </div>

        <label className="form-label">Split Type</label>
        <select className="form-select mb-3" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
          <option value="equal">Equal</option>
          <option value="specific">Specific Amount</option>
          <option value="percentage">Percentage</option>
        </select>

        <label className="form-label mt-3">Total Amount</label>
          <textarea
  className="form-control"
  rows="1"
  placeholder="Enter amount..."
  value={form.total}
  onChange={(e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setForm({ ...form, total: Number(val) });
  }}
></textarea>

        {form.type==='specific' && form.users.map(u=>(
          <input key={u} className="form-control mb-2" placeholder={`Amount for ${u}`} onChange={e=>setForm({...form, amounts:{...form.amounts,[u]:Number(e.target.value)}})} />
        ))}

        {form.type==='percentage' && form.users.map(u=>(
          <input key={u} className="form-control mb-2" placeholder={`% for ${u}`} onChange={e=>setForm({...form, percentages:{...form.percentages,[u]:Number(e.target.value)}})} />
        ))}

        
  
  
        <button style={styles.button} onClick={create}>Create Split</button>
       <button
        style={styles.closeBtn}
       
        onClick={() => nav("/dashboard")}
      >
        ✕ Close
      </button>
      
      </div>
    </div>
  );
}


