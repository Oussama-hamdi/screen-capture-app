import React, { useState, useEffect } from "react";
import CaptureSettings from "./components/CaptureSettings";
import ScreenshotList from "./components/ScreenshotList";
import "./App.css";

const App = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [userId, setUserId] = useState("1");
  const [interval, setInterval] = useState(5000);

  useEffect(() => {
    // Check capturing status on component mount
    const checkCapturingStatus = async () => {
      // Fetch the current status from Electron (optional: implement a method in main.js to provide status)
    };
    checkCapturingStatus();

    return () => {
      // Cleanup on component unmount
      window.electronAPI.stopCapturing();
    };
  }, []);

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
      />
      <button onClick={handleStartCapturing} disabled={isCapturing}>
        Start Taking Screenshots
      </button>
      <button onClick={handleStopCapturing} disabled={!isCapturing}>
        Stop Taking Screenshots
      </button>
      <ScreenshotList userId={userId} />
    </div>
  );
};

export default App;
