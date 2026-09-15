"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, setAuthToken, setCurrentUser, setIsAdmin } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const { ok, data } = await login(userName, password);

    // backend key name wasn't confirmed — accept whichever of these it sends
    const token = data && (data.jwt || data.token || data.accessToken);

    if (ok && token) {
      setAuthToken(token);
      setCurrentUser({ userName });
      setIsAdmin(Boolean(data.role === "ADMIN" || (data.roles || []).includes("ADMIN")));
      router.push("/journal");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input value={userName} onChange={(e) => setUserName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-full">Login</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}
