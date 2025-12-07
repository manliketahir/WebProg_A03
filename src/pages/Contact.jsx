import React from 'react';
import ContactForm from '../components/ContactForm';



export default function Contact() {
  return (
    <section style={{background:'var(--card)', padding:16, borderRadius:8}}>
      <h2>Contact Us</h2>
      <p style={{color:'var(--muted)'}}>Send us a message — submissions are stored in Firestore.</p>
      <ContactForm />
    </section>
  );
}