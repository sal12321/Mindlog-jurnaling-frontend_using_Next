"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getAuthToken,
  getIsAdmin,
  getAllUsers,
  createAdmin, deleteAdmin, updateAdmin
} from "../../lib/api";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import Navbar from "../Navbar";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    password: "",
    email: "",
    sentimentAnalysis: false,
    roles: ""
  });
   const [showNew, setShowNew] = useState(false);
    const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  
  const [loading, setLoading] = useState(true);
  const SENTIMENTS = ["True", "False"];

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/login");
      return;
    }
    if (!getIsAdmin()) {
      router.replace("/journal");
      return;
    }
    loadUsers();
  }, [router]);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const { ok, data } = await getAllUsers();
      if (ok) {
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function submitCreateAdmin(e) {
    e.preventDefault();
    const { ok } = await createAdmin(
      form.userName,
      form.password,
      form.email,
      form.sentimentAnalysis,
    );
    if (ok) {
      setShowModal(false);
      setForm({
        userName: "",
        password: "",
        email: "",
        sentimentAnalysis: false,
      });
      loadUsers();
    } else {
      setError("Failed to create admin");
    }
  }

  const handleEditDltBtn = async (user, id,  query) =>{

    if(query === "edit"){

      openEdit(user);
      


    }
    else if (query === "dlt"){
      deleteAdmin(user, id );

    }
    else{
      console.log("what a joke");
    }

      
  } 

    async function submitEdit(e) {
      e.preventDefault();
      const user = { sentimentAnalysis: form.sentimentAnalysis, userName: form.userName, email : form.email, roles: form.roles };

      const { status } = await updateAdmin(user);
      if (status === 202) {
        setEditing(null);
        loadUsers();
      } else {
        alert("Failed to update entry");
      }
    }
  
  function openEdit(user) {
    setEditing(user);
    setForm({ userName: user.userName,
        sentimentAnalysis: user.sentimentAnalysis || "",
         email : user.email,
          roles : user.roles || ["USER"] });
  }
 

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="journal-header">
          <h1>Admin Panel</h1>
          <div className="journal-actions">
            <a className="btn" href="/journal">
              Back to Journal
            </a>
            <button className="btn" onClick={() => setShowModal(true)}>
              Create Admin
            </button>
            <button className="btn btn-outline" onClick={loadUsers}>
              Refresh Users
            </button>
          </div>
        </div>
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <ClipLoader color="#2563eb" size={45} />
          </div>
        )}
        <div className="entries-grid">
          {!loading && !error && users.length === 0 && (
            <div>No users found</div>
          )}

          {users.map((user, i) => (
            <div
              className="entry-card"
              key={user.id?.timestamp ?? user.id ?? i}
            >
              <div className="entry-title">
                <span>{user.userName} </span> 
                <span className="edit-dlt-admin">
                  <button onClick={()=>{handleEditDltBtn(user , i, "edit", )}}>
                <Image
                  src="/images/edit.png"
                  alt="Description of image"
                  width={20}
                  height={20}
                />
                </button> 
                {getCurrentUser().userName !== user.userName ? <button onClick={()=>{handleEditDltBtn(user , i, "dlt")}}> 
                <Image
                  src="/images/delete.png"
                  alt="Description of image"
                  width={20}
                  height={20}
                />
                </button> : ""  }

              </span> 
              </div>

              <div className="entry-content">
                <strong>Email:</strong> {user.email || "N/A"}
                <br />
                <strong>Roles:</strong>{" "}
                {user.roles ? user.roles.join(", ") : "USER"}
                <br />
                <strong>Sentiment Analysis:</strong>{" "}
                {String(user.sentimentAnalysis ?? "false")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`modal ${showModal ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Create New Admin</h2>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>
          </div>
          {error && <div className="error">{error}</div>}
          <form onSubmit={submitCreateAdmin}>
            <div className="form-group">
              <label>Username</label>
              <input
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div
              className="form-group"
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <input
                type="checkbox"
                checked={form.sentimentAnalysis}
                onChange={(e) =>
                  setForm({ ...form, sentimentAnalysis: e.target.checked })
                }
              />
              <label style={{ marginLeft: 6 }}>Enable Sentiment Analysis</label>
            </div>
            <button type="submit" className="btn btn-full">
              Create Admin
            </button>
          </form>
        </div>
      </div>



            <div className={`modal ${editing ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Edit Admin </h2>
            <button className="close-btn" onClick={() => setEditing(null)}>&times;</button>
          </div>
          
          {/* here user isn not deifined */}
          <form onSubmit={(e)=>submitEdit(e)}>

            <div className="form-group">
              <label>username</label>
              <input value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>User email</label>
               <input        
                type="email" 
                value={form.email || "N/A"} 
                readOnly 
                className="read-only-input"  />
            </div>
            <div className="form-group">
              <label>Sentiment Analysis (Optional)</label>
              <select value={form.sentimentAnalysis} onChange={(e) => setForm({ ...form, sentimentAnalysis: e.target.value })}>
                <option value="{}">Select sentiment...</option>
                {SENTIMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Roles</label>
    <span className="static-text-value">
      {form.roles ? form.roles.join(", ") : "USER"}
    </span>
            </div>
            <button type="submit" className="btn btn-full">Update Admin</button>
          </form>
        </div>
      </div>
    </>
  );
}
