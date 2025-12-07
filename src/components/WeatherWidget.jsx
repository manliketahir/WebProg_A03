import React, { useEffect, useState } from 'react';
import styles from './WeatherWidget.module.css'; // Import the new styles

export default function WeatherWidget({ city }) {
  // 1. Prioritize the prop, then the env var, then default to Islamabad
  const targetCity = city || process.env.REACT_APP_WEATHER_DEFAULT_CITY || 'Islamabad';
  
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Direct fetch to backend port 8080
        const res = await fetch(`http://localhost:8080/api/weather?q=${encodeURIComponent(targetCity)}`);
        
        const text = await res.text();
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            throw new Error(`Server sent invalid JSON.`);
        }

        if (!res.ok) {
          throw json;
        }
        if (mounted) setWeather(json);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
  }, [targetCity]);

  if (loading) return <div className={styles.widget}>Loading weather...</div>;
  
  if (error) {
      const msg = error.message || (error.error && JSON.stringify(error.error)) || "Unknown Error";
      return <div className={`${styles.widget} ${styles.error}`}>Error: {msg}</div>;
  }

  const iconUrl = weather?.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : null;

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        {iconUrl && <img src={iconUrl} alt={weather.weather} className={styles.icon} />}
        <div>
          <div className={styles.city}>{weather.city}</div>
          <div className={styles.desc}>{weather.weather}</div>
        </div>
      </div>
      
      <div className={styles.temp}>
        {Math.round(weather.temp)}°
      </div>
      
      <div className={styles.details}>
        Feels like {Math.round(weather.feels_like)}° • Humidity {weather.humidity}%
      </div>
    </div>
  );
}