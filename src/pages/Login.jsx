import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import styles from './Auth.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (!result.success) {
            setError(result.error);
            // Wait a bit then clear error if needed
        }
    };

    return (
        <div className={styles.authContainer}>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <h2>Login</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="button" className={styles.authButton} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
