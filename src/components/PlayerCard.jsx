import React from 'react';
import styles from './PlayerCard.module.css'; // Import the module

export default function PlayerCard({ player }) {
  const imgField = (player && (player.image || player.img || player.photo)) || '';

  let src = '';
  if (typeof imgField === 'string' && imgField.trim()) {
    const t = imgField.trim();
    if (t.startsWith('http') || t.startsWith('/')) {
      src = t;
    } else {
      src = `/assets/${t}`;
    }
  }

  return (
    <div className={styles.card}> {/* Use styles.card */}
      <div className={styles.imageWrapper}>
        <img
          src={src}
          alt={player?.name || 'player'}
          className={styles.image}
          onError={(e) => e.target.style.display = 'none'} // Hide broken images cleanly
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{player?.name}</h3>
        <p className={styles.role}>{player?.role}</p>
        <p className={styles.bio}>{player?.description || player?.bio || 'No bio available.'}</p>
      </div>
    </div>
  );
}