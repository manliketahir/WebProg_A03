import React, { useState } from 'react';
import { addContact } from '../services/firebase';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      await addContact(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  
  return (
    <form onSubmit={handleSubmit} style={{maxWidth: 640}}>
      <label style={{display:'block', marginBottom:6}}>Name</label>
      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{width:'100%', padding:8, marginBottom:10}} />
      <label style={{display:'block', marginBottom:6}}>Email</label>
      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{width:'100%', padding:8, marginBottom:10}} />
      <label style={{display:'block', marginBottom:6}}>Message</label>
      <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} style={{width:'100%', padding:8, marginBottom:10}} />
      <div>
        <button type="submit" style={{background:'var(--accent)', color:'#fff', padding:'8px 12px', borderRadius:6}}>
          Send Message
        </button>
      </div>


      {status === 'loading' && <p style={{color: 'var(--muted)'}}>Sending...</p>}
      {status === 'success' && <p style={{color: 'green'}}>Message sent. Thanks!</p>}
      {status === 'error' && <p style={{color: 'red'}}>Error sending message.</p>}
    </form>
  );
}