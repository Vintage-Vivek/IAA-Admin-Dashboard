
import React, { useEffect, useState, useRef } from "react";
import styles from "./AdminDashboard.module.css";
import { downloadQueriesAsCSV } from "./AdminDashboardDownloadUtils";

const now = new Date();
const sampleData = [
  { id: 1, name: "Rahul Sharma", phone: "+91-9876543210", query: "What are the admission requirements?", datetime: now.toLocaleString() },
  { id: 2, name: "Priya Singh", phone: "+91-9123456780", query: "When does the next batch start?", datetime: now.toLocaleString() },
  { id: 3, name: "Amit Patel", phone: "+91-9988776655", query: "Is there a hostel facility?", datetime: now.toLocaleString() },
  { id: 4, name: "Sunita Rao", phone: "+91-9001122334", query: "What is the course fee?", datetime: now.toLocaleString() },
];


export default function AdminDashboard({ onLogout }) {
  const [queries, setQueries] = useState([]);
  const [resolvedSample, setResolvedSample] = useState({});
  const [resolvedReal, setResolvedReal] = useState({});
  const [removedSampleIds, setRemovedSampleIds] = useState([]);
  const [popup, setPopup] = useState({ open: false, id: null, type: null, isSample: false });
  const [noDataMsg, setNoDataMsg] = useState("");
  const [copiedPhone, setCopiedPhone] = useState("");
  const [popupProgress, setPopupProgress] = useState(100);
  const popupTimerRef = useRef(null);
  const [waPopup, setWAPopup] = useState({ open: false, phone: null });
  const waPopupTimerRef = useRef(null);

  const handlePhoneClick = (phone) => {
    // Copy phone number
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(""), 1200);
    }
    // Show WhatsApp popup for 2 seconds, then open WhatsApp Web
    setWAPopup({ open: true, phone });
    let progress = 100;
    setPopupProgress(100);
    waPopupTimerRef.current && clearInterval(waPopupTimerRef.current);
    waPopupTimerRef.current = setInterval(() => {
      progress -= 5;
      setPopupProgress(progress);
      if (progress <= 0) {
        clearInterval(waPopupTimerRef.current);
        setWAPopup({ open: false, phone: null });
        setPopupProgress(100);
        // Open WhatsApp Web
        const digits = phone.replace(/\D/g, "");
        if (digits.length >= 10) {
          const url = `https://wa.me/${digits}`;
          window.open(url, '_blank');
        }
      }
    }, 100);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/queries`)
      .then((res) => res.json())
      .then((data) => setQueries(data))
      .catch(() => setQueries([]));
  }, []);

  // --- Sample Data Handlers ---
  const handleSampleResolved = (id) => {
    setResolvedSample((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSampleDelete = (id) => {
    setPopup({ open: true, id, type: 'delete', isSample: true });
  };

  // --- Real Data Handlers ---
  const handleRealResolved = (id) => {
    setResolvedReal((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRealDelete = (id) => {
    setPopup({ open: true, id, type: 'delete', isSample: false });
  };

  // --- Popup Confirm Handler ---
  const handlePopupConfirm = async () => {
    clearInterval(popupTimerRef.current);
    if (popup.type === 'resolve') {
      if (popup.isSample) {
        setRemovedSampleIds((prev) => [...prev, popup.id]);
        setPopup({ open: false, id: null, type: null, isSample: false });
      } else {
        try {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/queries/${popup.id}/resolve-and-remove`, { method: 'POST' });
          setQueries((prev) => prev.filter((q) => q._id !== popup.id));
        } catch (e) { alert('Failed to resolve and remove query.'); }
        setPopup({ open: false, id: null, type: null, isSample: false });
      }
    } else if (popup.type === 'delete') {
      if (popup.isSample) {
        setRemovedSampleIds((prev) => [...prev, popup.id]);
        setPopup({ open: false, id: null, type: null, isSample: false });
      } else {
        try {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/queries/${popup.id}`, { method: 'DELETE' });
          setQueries((prev) => prev.filter((q) => q._id !== popup.id));
        } catch (e) { alert('Failed to delete query.'); }
        setPopup({ open: false, id: null, type: null, isSample: false });
      }
    }
    setPopupProgress(100);
  };

  const handlePopupCancel = () => {
    clearInterval(popupTimerRef.current);
    setPopup({ open: false, id: null, type: null, isSample: false });
    setPopupProgress(100);
  };

  // --- Popup Auto-close and Progress Bar ---
  useEffect(() => {
    if (popup.open) {
      setPopupProgress(100);
      let progress = 100;
      const decrement = 100 / 80; // 80 steps for 8 seconds at 100ms interval
      popupTimerRef.current && clearInterval(popupTimerRef.current);
      popupTimerRef.current = setInterval(() => {
        progress -= decrement;
        setPopupProgress(progress);
        if (progress <= 0) {
          clearInterval(popupTimerRef.current);
          setPopup({ open: false, id: null, type: null, isSample: false });
          setPopupProgress(100);
        }
      }, 100);
    }
    return () => clearInterval(popupTimerRef.current);
  }, [popup.open]);

  return (
    <>
      {/* Popup for WhatsApp Web */}
      {waPopup.open && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox} style={{ minWidth: 320, textAlign: 'center' }}>
            <div style={{height: 4, width: '100%', background: '#e5e7eb', borderRadius: 2, marginBottom: 12, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${popupProgress}%`, background: '#25d366', transition: 'width 0.1s linear'}} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb', margin: '18px 0 10px 0' }}>
              Opening WhatsApp Web…
            </div>
            <div style={{ fontSize: 15, color: '#222', marginBottom: 10 }}>
              {waPopup.phone}
            </div>
          </div>
        </div>
      )}
      {/* Popup for resolve/delete */}
      {popup.open && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <div style={{height: 4, width: '100%', background: '#e5e7eb', borderRadius: 2, marginBottom: 12, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${popupProgress}%`, background: popup.type === 'resolve' ? '#22c55e' : '#ef4444', transition: 'width 0.1s linear'}} />
            </div>
            <div className={popup.type === 'resolve' ? styles.popupTitleResolve : styles.popupTitleDelete}>
              {popup.type === 'resolve' ? 'Query resolved, want to remove?' : 'Want to delete the data?'}
            </div>
            <button onClick={handlePopupConfirm} className={styles.popupBtnRemove}>Remove</button>
            <button onClick={handlePopupCancel} className={styles.popupBtnCancel}>Cancel</button>
          </div>
        </div>
      )}
      <div className={styles.bgGradient} />
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>IAA WhatsApp Chatbot Admin Dashboard</h1>
          <p className={styles.subtitle}>Indian Aviation Academy</p>
          <div style={{ margin: '1rem 0', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className={styles.logoutBtn} style={{ background: '#0ea5e9' }}
              onClick={() => {
                const data = sampleData
                  .filter(row => !removedSampleIds.includes(row.id))
                  .map(row => ({ ...row, resolved: resolvedSample[row.id] ? 'Resolved' : '' }));
                downloadQueriesAsCSV(data, 'sample-queries.csv');
              }}
            >
              Download Sample Data
            </button>
            <button className={styles.logoutBtn} style={{ background: '#0ea5e9' }}
              onClick={() => {
                if (queries.length === 0) {
                  setNoDataMsg('No real data to download!');
                  setTimeout(() => setNoDataMsg(''), 2000);
                } else {
                  const data = queries.map(row => ({ ...row, resolved: resolvedReal[row._id] ? 'Resolved' : '' }));
                  downloadQueriesAsCSV(data, 'real-queries.csv');
                }
              }}
            >
              Download Real Data
            </button>
            {noDataMsg && <span style={{ color: '#ef4444', fontWeight: 600, alignSelf: 'center' }}>{noDataMsg}</span>}
          </div>
        </header>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Queries</h2>
          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.th}>Date/Time</th>
                <th className={styles.th}>Name</th>
                <th className={`${styles.th} ${styles.phoneCol}`}>Phone</th>
                <th className={styles.th}>Query</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th} style={{display:'none'}}>Resolved?</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.filter(row => !removedSampleIds.includes(row.id)).map((row) => (
                <tr key={row.id} className={resolvedSample[row.id] ? styles.resolvedRow : styles.tr}>
                  <td className={styles.td}>{row.datetime}</td>
                  <td className={styles.td}>{row.name}</td>
                  <td className={`${styles.td} ${styles.phoneCol}`}>
                    <span
                      style={{ cursor: 'pointer', color: '#0ea5e9', textDecoration: 'underline', userSelect: 'all' }}
                      onClick={() => handlePhoneClick(row.phone)}
                      title="Click to copy"
                    >
                      {row.phone}
                    </span>
                    {copiedPhone === row.phone && (
                      <div style={{ color: '#22c55e', fontSize: 13, marginTop: 2 }}>Copied!</div>
                    )}
                  </td>
                  <td className={styles.td} style={{whiteSpace:'pre-line'}}>{row.query}</td>
                  <td className={`${styles.td} ${styles.statusCell}`}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleSampleDelete(row.id)}
                    >
                      Delete
                    </button>
                    <button
                      className={`${styles.resolvedBtn} ${resolvedSample[row.id] ? styles.resolvedBtnActive : styles.resolvedBtnInactive}`}
                      onClick={() => handleSampleResolved(row.id)}
                    >
                      {resolvedSample[row.id] ? 'Unresolve' : 'Resolve'}
                    </button>
                  </td>
                  <td className={styles.td} style={{display:'none'}}>{resolvedSample[row.id] ? 'Resolved' : ''}</td>
                </tr>
              ))}
              {queries.length > 0 && queries.map((row, idx) => (
                <tr key={row._id || idx + 1000} className={resolvedReal[row._id] ? styles.resolvedRow : styles.tr}>
                  <td className={styles.td}>{row.datetime || (row.createdAt ? new Date(row.createdAt).toLocaleString() : '')}</td>
                  <td className={styles.td}>{row.name}</td>
                  <td className={`${styles.td} ${styles.phoneCol}`}>
                    <span
                      style={{ cursor: 'pointer', color: '#0ea5e9', textDecoration: 'underline', userSelect: 'all' }}
                      onClick={() => handlePhoneClick(row.phone)}
                      title="Click to copy"
                    >
                      {row.phone}
                    </span>
                    {copiedPhone === row.phone && (
                      <span style={{ color: '#22c55e', marginLeft: 8, fontSize: 13 }}>Copied!</span>
                    )}
                  </td>
                  <td className={styles.td} style={{whiteSpace:'pre-line'}}>{row.query}</td>
                  <td className={`${styles.td} ${styles.statusCell}`}>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleRealDelete(row._id)}
                    >
                      Delete
                    </button>
                    <button
                      className={`${styles.resolvedBtn} ${resolvedReal[row._id] ? styles.resolvedBtnActive : styles.resolvedBtnInactive}`}
                      onClick={() => handleRealResolved(row._id)}
                    >
                      {resolvedReal[row._id] ? 'Unresolve' : 'Resolve'}
                    </button>
                  </td>
                  <td className={styles.td} style={{display:'none'}}>{resolvedReal[row._id] ? 'Resolved' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className={styles.logoutWrapper}>
          <button onClick={onLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
