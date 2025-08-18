import React from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection({ onGetStarted }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Welcome to iaa <br /> Query Portal</h1>
        <p className={styles.heroSubtitle}>
          Submit your queries and our team will get back to you as soon as possible.
        </p>
        <div className={styles.heroActions}>
          <button className={styles.ctaBtn} onClick={onGetStarted}>Get Started</button>
        </div>
      </div>
    </section>
  );
} 