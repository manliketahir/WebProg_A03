import React, { useEffect, useState, useContext } from 'react';
import PlayerCard from '../components/PlayerCard';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../services/api';
import AuthContext from '../context/AuthContext';
import styles from './Auth.module.css'; // Reusing auth styles for form

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sw-favorites')) || [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', image: null });
  const [editingId, setEditingId] = useState(null);

  const fetchPlayersData = async () => {
    setLoading(true);
    try {
      const data = await getPlayers(page, query);
      setPlayers(data.players);
      setTotalPages(data.pages);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load players. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayersData();
    // eslint-disable-next-line
  }, [page, query]);

  useEffect(() => {
    try {
      localStorage.setItem('sw-favorites', JSON.stringify(favorites));
    } catch { }
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  }

  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', formData.role);
    data.append('bio', formData.bio);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        await updatePlayer(editingId, data);
        alert('Player updated!');
      } else {
        await createPlayer(data);
        alert('Player created!');
      }
      setShowForm(false);
      setFormData({ name: '', role: '', bio: '', image: null });
      setEditingId(null);
      fetchPlayersData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving player');
    }
  };

  const handleEdit = (player) => {
    setFormData({ name: player.name, role: player.role, bio: player.bio, image: null });
    setEditingId(player._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deletePlayer(id);
        fetchPlayersData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting player');
      }
    }
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Our Star Players</h2>
        <div>
          <input
            placeholder="Search players..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ padding: 8, marginRight: '10px' }}
          />
          {user && (
            <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', role: '', bio: '', image: null }); }} style={{ padding: 8 }}>
              {showForm ? 'Cancel' : 'Add Player'}
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className={styles.authForm} style={{ margin: '0 auto 2rem auto' }}>
          <h3>{editingId ? 'Edit Player' : 'Add New Player'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Role</label>
              <input name="role" value={formData.role} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Bio</label>
              <input name="bio" value={formData.bio} onChange={handleInputChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Image</label>
              <input type="file" name="image" onChange={handleInputChange} />
            </div>
            <button type="submit" className={styles.authButton}>{editingId ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}

      {loading && <p>Loading players...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {players.map(p => (
          <div key={p._id} style={{ position: 'relative' }}>
            <PlayerCard
              player={{
                ...p,
                id: p._id,
                image: p.image.startsWith('http')
                  ? p.image
                  : p.image.startsWith('/uploads')
                    ? `http://localhost:5000${p.image}`
                    : p.image
              }}
              isFavorite={favorites.includes(p._id)}
              onToggleFavorite={toggleFavorite}
            />
            {user && (user._id === p.user || user.role === 'admin') && (
              <div style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(255,255,255,0.8)', padding: 5, borderRadius: 4 }}>
                <button onClick={() => handleEdit(p)} style={{ marginRight: 5, cursor: 'pointer' }}>✏️</button>
                <button onClick={() => handleDelete(p._id)} style={{ cursor: 'pointer', color: 'red' }}>🗑️</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </section>
  );
}