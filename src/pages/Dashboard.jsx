import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import styles from './Auth.module.css';

const Dashboard = () => {
    const { user, token, logout } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('data'); // data, update, password

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const updateProfile = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/updatedetails', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email })
            });
            const data = await res.json();
            if (res.ok) {
                setMsg('Profile Updated!');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    const updatePass = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/updatepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setMsg('Password Updated!');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong');
        }
    };

    const tabStyle = (tabName) => ({
        padding: '0.75rem 1.5rem',
        cursor: 'pointer',
        background: activeTab === tabName ? 'var(--accent)' : 'var(--bg)',
        color: activeTab === tabName ? '#fff' : 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        fontWeight: 600,
        transition: 'all 0.2s'
    });

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <h1>Dashboard</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('data')} style={tabStyle('data')}>Overview</button>
                <button onClick={() => setActiveTab('update')} style={tabStyle('update')}>Update Profile</button>
                <button onClick={() => setActiveTab('password')} style={tabStyle('password')}>Change Password</button>
            </div>

            <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
                {msg && <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{msg}</div>}
                {error && <div className={styles.errorMessage}>{error}</div>}

                {activeTab === 'data' && (
                    <div>
                        <h2 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Welcome, {user ? user.name : 'User'}!</h2>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <p><strong style={{ color: 'var(--muted)' }}>Email:</strong> {user ? user.email : ''}</p>
                            <p><strong style={{ color: 'var(--muted)' }}>Role:</strong> {user ? user.role : 'user'}</p>
                        </div>

                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--muted)' }}>Matches</h3>
                                <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: 'var(--accent)' }}>12</p>
                            </div>
                            <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center' }}>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--muted)' }}>Players</h3>
                                <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: 'var(--accent)' }}>25</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'update' && (
                    <div style={{ maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Update Profile</h2>
                        <form onSubmit={updateProfile} className={styles.authForm} style={{ boxShadow: 'none', padding: 0, width: '100%', border: 'none' }}>
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <button className={styles.authButton}>Save Changes</button>
                        </form>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div style={{ maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Change Password</h2>
                        <form onSubmit={updatePass} className={styles.authForm} style={{ boxShadow: 'none', padding: 0, width: '100%', border: 'none' }}>
                            <div className={styles.formGroup}>
                                <label>Current Password</label>
                                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>New Password</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <button className={styles.authButton}>Update Password</button>
                        </form>
                    </div>
                )}

                <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <button
                        onClick={logout}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
