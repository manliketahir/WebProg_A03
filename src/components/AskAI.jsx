import React, { useState } from 'react';
import styles from './AskAI.module.css';

export default function AskAI() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState(null);

  async function handleAsk() {
    if (!prompt.trim()) return;
    setLoading(true); setReply(''); setLastError(null);

    const proxyUrl = 'http://localhost:8080/api/gemini';
    console.log('[AskAI] using proxy URL:', proxyUrl);

    try {
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      console.log('[AskAI] response status', res.status);
      const text = await res.text();
      try {
        const parsed = JSON.parse(text);
        if (!res.ok) {
          setLastError({ status: res.status, body: parsed });
        } else {
          setReply(parsed.output || JSON.stringify(parsed, null, 2));
        }
      } catch (e) {
        if (!res.ok) setLastError({ status: res.status, body: text });
        else setReply(text);
      }
    } catch (err) {
      console.error('[AskAI] network / fetch error', err);
      setLastError({ message: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h3>Ask AI</h3>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} />
      <button onClick={handleAsk} disabled={loading || !prompt.trim()}>
        {loading ? 'Asking...' : 'Ask Gemini'}
      </button>
      <div>{reply || <i>Responses will appear here</i>}</div>
      {lastError && <pre>{JSON.stringify(lastError, null, 2)}</pre>}
    </div>
  );
}