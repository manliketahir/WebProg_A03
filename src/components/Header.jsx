import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import AuthContext from '../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 className={styles.title}>🏆 Sports World</h1>
          <nav className={styles.nav}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ''}>About</NavLink>
            <NavLink to="/players" className={({ isActive }) => isActive ? styles.active : ''}>Players</NavLink>
            <NavLink to="/fixtures" className={({ isActive }) => isActive ? styles.active : ''}>Fixtures</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? styles.active : ''}>Contact</NavLink>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>Dashboard</NavLink>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : ''}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? styles.active : ''}>Register</NavLink>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}