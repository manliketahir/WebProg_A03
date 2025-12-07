import React, { useEffect, useState } from 'react';
import { fetchFixturesFromPublic } from '../services/cricketApi';

export default function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFixturesFromPublic()
      .then(data => {
        // data shape adapts; try to map to date, teams, venue
        const list = data?.matches || data?.fixtures || data || [];
        const mapped = list.slice(0, 10).map((m, idx) => ({
          id: m.id || idx + 1,
          date: m.date || m.match_date || m.dateTime || 'TBD',
          teams: m.title || (m.team1 && m.team2 ? `${m.team1} vs ${m.team2}` : m.name || 'Match'),
          venue: m.venue || m.location || m.stadium || 'Unknown'
        }));
        setFixtures(mapped);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load fixtures.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2>Upcoming Matches</h2>
      {loading && <p>Loading fixtures...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}

      <div style={{marginTop:12}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr style={{textAlign:'left', color:'var(--muted)'}}>
              <th style={{padding:8}}>Date</th>
              <th style={{padding:8}}>Match</th>
              <th style={{padding:8}}>Venue</th>
            </tr>
          </thead>
          <tbody>
            {fixtures.map(f => (
              <tr key={f.id} style={{borderTop:'1px solid rgba(0,0,0,0.06)'}}>
                <td style={{padding:8}}>{f.date}</td>
                <td style={{padding:8}}>{f.teams}</td>
                <td style={{padding:8}}>{f.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}