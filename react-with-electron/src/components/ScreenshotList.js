import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ScreenshotList.css";

const ScreenshotList = ({ userId }) => {
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is required to fetch screenshots.");
      return;
    }

    const fetchScreenshots = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3499/api/screenshots/${userId}`
        );
        setScreenshots(response.data[0]?.screenshots || []);
      } catch (error) {
        console.error("Failed to fetch screenshots:", error.message);
      }
    };

    fetchScreenshots();

    // WebSocket setup
    const ws = new WebSocket("ws://localhost:3499");

    ws.onmessage = (event) => {
      const { type, userId: newUserId } = JSON.parse(event.data);
      if (type === "new_screenshot" && newUserId === userId) {
        fetchScreenshots(); // Refresh the screenshot list
      }
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  return (
    <div>
      <h2 className="screenshots-title">Your Screenshots</h2>
      {screenshots.length > 0 ? (
        <div className="screenshots-container">
          {screenshots.map((screenshot, index) => (
            <div className="screenshot" key={index}>
              <img
                src={`data:image/png;base64,${screenshot.image}`}
                alt={`Screenshot ${index + 1}`}
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
              <p>
                Timestamp: {new Date(screenshot.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No screenshots found.</p>
      )}
    </div>
  );
};

export default ScreenshotList;
