"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuthToken,
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  sendSentimentEmail,
} from "../../lib/api";
import Navbar from "../Navbar";

const SENTIMENTS = ["HAPPY", "SAD", "ANGRY", "ANXIOUS"];

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null); // entry object being edited, or null

  const [form, setForm] = useState({ title: "", content: "", sentiment: "" });

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/login");
      return;
    }
    loadEntries();
  }, [router]);

  async function loadEntries() {
    const { ok, data } = await getAllEntries();
    if (ok) {
      setEntries(Array.isArray(data) ? data : []);
    } else {
      setLoadError("Failed to load entries");
    }
  }

  function openNew() {
    setForm({ title: "", content: "", sentiment: "" });
    setShowNew(true);
  }

  async function submitNew(e) {
    e.preventDefault();
    const entry = { title: form.title, content: form.content };
    if (form.sentiment) entry.sentiment = form.sentiment;

    const { ok } = await createEntry(entry);
    if (ok) {
      setShowNew(false);
      loadEntries();
    } else {
      alert("Failed to create entry");
    }
  }

  function openEdit(entry) {
    setEditing(entry);
    setForm({ title: entry.title, content: entry.content, sentiment: entry.sentiment || "" });
  }

  async function submitEdit(e) {
    e.preventDefault();
    const entry = { title: form.title, content: form.content };
    if (form.sentiment) entry.sentiment = form.sentiment;

    const { status } = await updateEntry(editing.id, entry);
    if (status === 200) {
      setEditing(null);
      loadEntries();
    } else {
      alert("Failed to update entry");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    const { ok } = await deleteEntry(id);
    if (ok) loadEntries();
    else alert("Failed to delete entry");
  }

  async function handleSentimentEmail() {
    const { ok } = await sendSentimentEmail();
    alert(ok ? "Sentiment report sent to your email!" : "Failed to send sentiment report");
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="journal-header">
          <h1>My Journal</h1>
          <div className="journal-actions">
            <button className="btn" onClick={openNew}>✏️ New Entry</button>
            <button className="btn btn-outline" onClick={handleSentimentEmail}>📧 Get Sentiment Report</button>
          </div>
        </div>

        {loadError && <div className="error">{loadError}</div>}

        <div className="entries-grid">
          {entries.length === 0 && !loadError && <div>No entries yet. Create your first journal entry!</div>}
          {entries.map((entry) => (
            <div className={`entry-card ${entry.sentiment ? `sentiment-${entry.sentiment}` : ""}`} key={entry.id}>
              <div className="entry-title">{entry.title}</div>
              <div className="entry-date">
                {entry.date ? new Date(entry.date).toLocaleString() : ""}
              </div>
              {entry.sentiment && <span className="sentiment-badge">{entry.sentiment}</span>}
              <div className="entry-content">{entry.content}</div>
              <div className="entry-actions">
                <button className="btn btn-small" onClick={() => openEdit(entry)}>Edit</button>
                <button className="btn btn-small btn-danger" onClick={() => handleDelete(entry.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New entry modal */}
      <div className={`modal ${showNew ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>New Journal Entry</h2>
            <button className="close-btn" onClick={() => setShowNew(false)}>&times;</button>
          </div>
          <form onSubmit={submitNew}>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Sentiment (Optional)</label>
              <select value={form.sentiment} onChange={(e) => setForm({ ...form, sentiment: e.target.value })}>
                <option value="">Select sentiment...</option>
                {SENTIMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-full">Save Entry</button>
          </form>
        </div>
      </div>

      {/* Edit entry modal */}
      <div className={`modal ${editing ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Edit Journal Entry</h2>
            <button className="close-btn" onClick={() => setEditing(null)}>&times;</button>
          </div>
          <form onSubmit={submitEdit}>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Sentiment (Optional)</label>
              <select value={form.sentiment} onChange={(e) => setForm({ ...form, sentiment: e.target.value })}>
                <option value="">Select sentiment...</option>
                {SENTIMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-full">Update Entry</button>
          </form>
        </div>
      </div>
    </>
  );
}
