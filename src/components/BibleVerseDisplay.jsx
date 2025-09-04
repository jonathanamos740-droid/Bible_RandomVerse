import { useState, useEffect } from "react";
import "./BibleVerseDisplay.css";
import { RefreshCw, Clock } from "lucide-react"; // still using lucide-react icons

export default function BibleVerseDisplay() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchRandomVerse = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://bible-api.com/?random=verse");

      if (!response.ok) {
        throw new Error("Failed to fetch verse");
      }

      const data = await response.json();
      setVerse(data);
    } catch (err) {
      setError("Failed to load Bible verse. Please try again.");
      console.error("Error fetching verse:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial verse
  useEffect(() => {
    fetchRandomVerse();
  }, []);

  // Auto-refresh every 30 minutes when enabled
  useEffect(() => {
    if (!autoRefresh) return;
 
    const interval = setInterval(() => {
      fetchRandomVerse();
    }, 0.5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    fetchRandomVerse();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="verse-card">
      <div className="verse-content">
        {loading && !verse && (
          <div className="loading">
            <RefreshCw className="spin" size={20} />
            <span>Loading verse...</span>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={handleManualRefresh} className="btn-outline">
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && verse && (
          <div className="verse-text">
            <blockquote>"{verse.text}"</blockquote>
            <cite>— {verse.reference}</cite>
            <p className="translation">{verse.translation_name}</p>
          </div>
        )}

        <div className="controls">
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="btn-outline"
          >
            {loading ? (
              <RefreshCw size={16} className="spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            New Verse
          </button>

          <button
            onClick={toggleAutoRefresh}
            className={autoRefresh ? "btn" : "btn-outline"}
          >
            <Clock size={16} />
            Auto-refresh {autoRefresh ? "On" : "Off"}
          </button>
        </div>

        {autoRefresh && (
          <p className="note">Automatically refreshes every 30 secpnds</p>
        )}
      </div>
    </div>
  );
}
