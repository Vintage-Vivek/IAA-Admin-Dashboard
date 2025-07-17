
import React, { useState } from "react";
import styles from "./QueryForm.module.css";
import Navbar from "./Navbar/Navbar";


export default function QueryForm() {
  const [queryType, setQueryType] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const datetime = new Date().toISOString();
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, query, datetime, queryType })
      });
      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setQuery("");
      } else {
        setError("Failed to submit query. Please try again.");
      }
    } catch {
      setError("Failed to submit query. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.bgGradient}>
      <Navbar />
      <div className={styles.centered}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>IAA WhatsApp Chatbot Query Form</h1>
          <p className={styles.subtitle}>Indian Aviation Academy</p>
          <h2 className={styles.formTitle}>Submit Your Query</h2>
          <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Select Query Type:</span>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 30 }}>
              <label style={{ fontSize: 15, cursor: 'pointer', color: '#222', display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="queryType"
                  value="general"
                  checked={queryType === "general"}
                  onChange={() => setQueryType("general")}
                  style={{ marginRight: 6 }}
                />
                General Query (Academics)
              </label>
              <label style={{ fontSize: 15, cursor: 'pointer', color: '#222', display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  name="queryType"
                  value="elms"
                  checked={queryType === "elms"}
                  onChange={() => setQueryType("elms")}
                  style={{ marginRight: 6 }}
                />
                ELMS (Electrical Load Management System)
              </label>
            </div>
          </div>
          {queryType === "elms" ? (
            <div style={{
              fontWeight: 700,
              fontSize: 24,
              color: '#b91c1c',
              textAlign: 'center',
              margin: '40px 0'
            }}>
              For ELMS query refer to - <a href="https://iaa.edu.in/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 700 }}>https://iaa.edu.in/</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={styles.input}
                required
              />
              <textarea
                placeholder="Your Query"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className={styles.textarea}
                rows={4}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
          {success && <div style={{ color: '#22c55e', marginTop: 12 }}>Query submitted successfully!</div>}
          {error && <div style={{ color: '#ef4444', marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
