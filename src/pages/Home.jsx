import React from 'react';
import VideoPlayer from '../components/VideoPlayer';
import AskAI from '../components/AskAI';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';

export default function Home() {
  return (
    <div>
      <section style={{display:'flex', gap:'1rem', alignItems:'center', justifyContent:'space-between', marginBottom: '1.25rem', background:'var(--card)', padding:16, borderRadius:8}}>
        <div style={{flex:1}}>
          <h2>Welcome to Sports World</h2>
          <p style={{color:'var(--muted)'}}>Your hub for cricket players, fixtures, and interactive AI assistance.</p>
          <p><Link to="/players">Browse players →</Link></p>
        </div>
        <div style={{width:360}}>
          <AskAI />
        </div>
      </section>
      <section style={{ marginTop: 20 }}>
        <WeatherWidget city="Islamabad" />
      </section>

      <section style={{display:'grid', gap:16}}>
        <VideoPlayer />
      </section>
    </div>
  );
}