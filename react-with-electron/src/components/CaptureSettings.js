import React, { useState } from "react";
import "./CaptureSettings.css"; // Import a CSS file for styling

const CaptureSettings = ({ interval, setInterval, userId, setUserId }) => {
  const [error, setError] = useState("");

  const handleIntervalChange = (e) => {
    // Allow empty input and handle valid number values
    const value = e.target.value;
    setInterval(value === "" ? "" : Number(value));
  };

  const handleUpdateConfig = () => {
    if (interval === "" || interval < 1000) {
      setError("Interval must be at least 1000 ms.");
      return;
    }
    setError("");
    window.electronAPI?.updateConfig({ interval, userId });
  };

  return (
    <div className="capture-settings">
      <h2>Capture Settings</h2>
      <div className="form-group">
        <label htmlFor="interval">Screenshot Interval (ms):</label>
        <input
          id="interval"
          type="number"
          value={interval}
          onChange={handleIntervalChange}
          className={`input-field ${error ? "input-error" : ""}`}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="userId">User ID:</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="input-field"
        />
      </div>
      <button onClick={handleUpdateConfig} className="update-button">
        Update Config
      </button>
    </div>
  );
};

export default CaptureSettings;
