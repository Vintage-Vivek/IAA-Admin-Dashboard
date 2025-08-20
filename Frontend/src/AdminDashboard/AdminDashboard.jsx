import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { downloadQueriesAsCSV } from "./AdminDashboardDownloadUtils";
import Navbar from "../pages/Navbar/Navbar";
import JointVenture from "../pages/joint_venture/joint_venture";
import Footer from "../pages/footer/footer";

export default function AdminDashboard({ onLogout }) {
  const [queries, setQueries] = useState([]);
  const [resolvedReal, setResolvedReal] = useState({});
  const [noDataMsg, setNoDataMsg] = useState("");
  const [copiedPhone, setCopiedPhone] = useState("");

  // 🔴 Removed popup state and timers
  // const [popup, setPopup] = useState({ open: false, id: null, type: null });
  // const [popupProgress, setPopupProgress] = useState(100);
  // const popupTimerRef = useRef(null);

  const [waPopup, setWAPopup] = useState({ open: false, phone: null });
  const [popupProgress, setPopupProgress] = useState(100);

  const handlePhoneClick = (phone) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(""), 1200);
    }
    setWAPopup({ open: true, phone });
    let progress = 100;
    setPopupProgress(100);
    const timer = setInterval(() => {
      progress -= 5;
      setPopupProgress(progress);
      if (progress <= 0) {
        clearInterval(timer);
        setWAPopup({ open: false, phone: null });
        setPopupProgress(100);
        const digits = phone.replace(/\D/g, "");
        if (digits.length >= 10) {
          const url = `https://wa.me/${digits}`;
          window.open(url, "_blank");
        }
      }
    }, 100);
  };

  useEffect(() => {
    console.log('Fetching queries...');
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/queries`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((response) => {
        console.log('Queries response:', response);
        // Check if response is an array directly or nested in data property
        const queriesData = Array.isArray(response) ? response : response.data;
        if (Array.isArray(queriesData)) {
          setQueries(queriesData);
          console.log('Queries set:', queriesData.length);
        } else {
          console.error('Invalid response format:', response);
          setQueries([]);
        }
      })
      .catch(() => setQueries([]));
  }, []);

  const handleRealResolved = (id) => {
    setResolvedReal((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✅ Direct delete without popup
  const handleRealDelete = async (id) => {
    try {
      const res = await fetch(`/api/queries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setQueries((prev) => prev.filter((q) => q._id !== id));
      } else {
        const data = await res.json();
        alert("Failed to delete query: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Failed to delete query.");
    }
  };

  const handleRefresh = async () => {
    try {
      const res = await fetch("/api/queries");
      const data = await res.json();
      setQueries(data);
    } catch (error) {
      console.error("Failed to refresh queries:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.pageBackground}>
        <div className={styles.mainContent}>
          {/* 🔴 Removed resolve/delete popup */}
          {/* {popup.open && (...) } */}

          {waPopup.open && (
            <div className={styles.popupOverlay}>
              <div className={styles.popupBox}>
                <div className={styles.popupProgressBar}>
                  <div style={{ width: `${popupProgress}%` }} />
                </div>
                <div className={styles.popupTitleWhatsApp}>
                  Opening WhatsApp Web…
                </div>
                <div className={styles.popupPhone}>{waPopup.phone}</div>
              </div>
            </div>
          )}

          <div className={styles.header}>
            <h1 className={styles.title}>
              iaa Query Portal Admin Dashboard
            </h1>
            <p className={styles.subtitle}>Indian Aviation Academy</p>
            <div className={styles.downloadContainer}>
              <button
                className={styles.logoutBtnDownload}
                onClick={() => {
                  if (queries.length === 0) {
                    setNoDataMsg("No real data to download!");
                    setTimeout(() => setNoDataMsg(""), 2000);
                  } else {
                    const data = queries.map((row) => ({
                      ...row,
                      resolved: resolvedReal[row._id] ? "Resolved" : "",
                    }));
                    downloadQueriesAsCSV(data, "real-queries.csv");
                  }
                }}
              >
                Download Real Data
              </button>
              {noDataMsg && (
                <span className={styles.noDataMsg}>{noDataMsg}</span>
              )}
            </div>
          </div>

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
                </tr>
              </thead>
              <tbody>
                {queries.map((row) => (
                  <tr key={row._id}>
                    <td className={styles.td}>
                      {row.datetime
                        ? new Date(row.datetime).toLocaleString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : row.createdAt
                        ? new Date(row.createdAt).toLocaleString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : ""}
                    </td>
                    <td className={styles.td}>{row.name}</td>
                    <td className={`${styles.td} ${styles.phoneCol}`}>
                      <a
                        href={`https://wa.me/${(() => {
                          const d = (row.phone || "").replace(/\D/g, "");
                          return d.length > 10 ? "91" + d.slice(-10) : "91" + d;
                        })()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handlePhoneClick(row.phone || "")}
                      >
                        {(() => {
                          let p = row.phone || "";
                          p = p.replace(/^\+?91[- ]?/, "");
                          return "+91-" + p.replace(/\D/g, "");
                        })()}
                      </a>
                      {copiedPhone === row.phone && (
                        <span className={styles.copiedMsg}>Copied!</span>
                      )}
                    </td>
                    <td
                      className={`${styles.td}`}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {row.query}
                    </td>
                    <td className={`${styles.td} ${styles.statusCell}`}>
                      {/* ✅ Now delete immediately */}
                      <button
                        onClick={() => handleRealDelete(row._id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleRealResolved(row._id)}
                        className={`${styles.resolvedBtn} ${
                          resolvedReal[row._id]
                            ? styles.resolvedBtnActive
                            : styles.resolvedBtnInactive
                        }`}
                      >
                        {resolvedReal[row._id] ? "Unresolve" : "Resolve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className={styles.logoutWrapper}>
            <button onClick={handleRefresh} className={styles.refreshBtn}>
              Refresh
            </button>
            <button onClick={onLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <JointVenture />
      <Footer />
    </>
  );
}
