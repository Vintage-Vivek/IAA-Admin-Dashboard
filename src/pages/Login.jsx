import React, { useState } from "react";
import styles from "./Login.module.css";
import Navbar from "./Navbar/Navbar";


export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      onLogin();
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLogin();
      } else {
        alert("Wrong username or password");
      }
    } catch {
      alert("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    
    <div className={styles.bgGradient}>
      <Navbar />
      <div className={styles.centered}>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>IAA WhatsApp Chatbot Admin Dashboard</h1>
          <p className={styles.subtitle}>Indian Aviation Academy</p>
          <h2 className={styles.formTitle}>Admin Login</h2>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.input}
              required
            />
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`${styles.input} ${styles.inputPassword}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className={styles.showHideBtn}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.61 1.81-3.06 3.06-4.24M9.9 4.24A9.77 9.77 0 0 1 12 4c5 0 9.27 3.89 11 8-1.02 2.22-2.77 4.19-4.9 5.76"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={styles.loginBtn}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
