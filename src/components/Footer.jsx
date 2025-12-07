import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span>© 2025 Sports World</span>
        <span style={{color:'var(--muted)'}}>Built with React, Firebase & a Gemini proxy</span>
      </div>
    </footer>
  );
}