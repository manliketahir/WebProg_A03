import React from 'react';

export default function About() {
  return (
    <section style={{background:'var(--card)', padding:16, borderRadius:8}}>
      <h2>About Us</h2>
      <p style={{color:'var(--muted)'}}>We promote cricket content: player profiles, fixtures, and news. This React app is a rewrite of a static site with dynamic features — state, API fetch, localStorage, Firebase form storage, and an AI assistant.</p>
    </section>
  );
}