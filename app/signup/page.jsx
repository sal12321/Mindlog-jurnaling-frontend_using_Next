"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sentimentAnalysis, setSentimentAnalysis] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const { status, data } = await signup(userName, email, password, sentimentAnalysis);

    if (status === 200 || status === 201) {
      router.push("/login");
    } else if (status === 409) {
      setError((data && data.message) || "Username already exists");
    } else {
      setError("Signup failed. Please try again.");
    }
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input value={userName} onChange={(e) => setUserName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group" style={{ flexDirection: "row", alignItems: "center" }}>
          <input
            type="checkbox"
            id="sentimentAnalysis"
            checked={sentimentAnalysis}
            onChange={(e) => setSentimentAnalysis(e.target.checked)}
          />
          <label htmlFor="sentimentAnalysis" style={{ marginLeft: 6 }}>Enable Sentiment Analysis</label>
        </div>
        <button type="submit" className="btn btn-full">Sign Up</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
