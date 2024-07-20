import React, { useState } from "react";
import CaptureSettings from "./components/CaptureSettings";
import ScreenshotList from "./components/ScreenshotList";
import "./App.css";

const App = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [userId, setUserId] = useState("1");
  const [interval, setInterval] = useState(5000);

  const handleStartCapturing = () => {
    setIsCapturing(true);
    window.electronAPI.updateConfig({ interval, userId });
  };

  const handleStopCapturing = () => {
    setIsCapturing(false);
    window.electronAPI.stopCapturing();
  };

  return (
    <div className="app">
      <h1 className="app-header">Screenshot App</h1>
      <CaptureSettings
        interval={interval}
        setInterval={setInterval}
        userId={userId}
        setUserId={setUserId}
        setIsCapturing={setIsCapturing}
      />
      <div className="button-container">
        <button
          onClick={handleStartCapturing}
          disabled={isCapturing}
          className="action-button"
        >
          Start Taking Screenshots
        </button>
        <button
          onClick={handleStopCapturing}
          disabled={!isCapturing}
          className="action-button"
        >
          Stop Taking Screenshots
        </button>
      </div>
      <ScreenshotList userId={userId} />
    </div>
  );
};

export default App;
