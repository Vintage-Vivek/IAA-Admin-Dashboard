import React from "react";
import styles from "./LoginHeroSection.module.css";
import DesignVideo from "../Helper/Design Images/Design_Video.mp4";

const LoginHeroSection = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.heroSection}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBackground}
      >
        <source src={DesignVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>Welcome to iaa</h1>
          <p className={styles.subtitle}>Indian Aviation Academy</p>
          <p className={styles.description}>
            Nurturing Aviation for the Future
          </p>
          <button className={styles.scrollTopBtn} onClick={handleScrollToTop}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginHeroSection; 