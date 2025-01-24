import React, { useEffect, useState } from "react";
import axios from "axios";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages and sort them by timestamp
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "https://lin-server.onrender.com/api/getMessages"
        );
        // Sort messages by timestamp in descending order (newest first)
        const sortedMessages = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setMessages(sortedMessages);
      } catch (err) {
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Toggle read/unread status and update the database
  const toggleReadStatus = async (_id, isRead) => {
    try {
      await axios.put(
        `https://lin-server.onrender.com/api/updateMessage/${_id}`,
        {
          isRead: !isRead,
        }
      );

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === _id ? { ...message, isRead: !isRead } : message
        )
      );
    } catch (err) {
      console.error("Failed to update message status:", err);
      alert("Could not update message status. Please try again.");
    }
  };

  // Delete a message and update the state
  const deleteMessage = async (_id) => {
    try {
      await axios.delete(
        `https://lin-server.onrender.com/api/deleteMessage/${_id}`
      );

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== _id)
      );
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert("Could not delete the message. Please try again.");
    }
  };

  // Format timestamp for better readability
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        Messages ({messages.length})
      </h1>
      {messages.length === 0 ? (
        <div className="text-center text-muted">
          <h3>No messages yet</h3>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: "0" }}>
          {messages.map((message) => (
            <li
              key={message._id}
              style={{
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: message.isRead ? "#f5f5f5" : "#fff8e1",
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                overflowWrap: "break-word", // Handles long words
                wordWrap: "break-word", // Ensures long text wraps
                wordBreak: "break-word", // Handles unbroken text chunks
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong style={{ fontSize: "16px", color: "#555" }}>
                  {message.senderName}
                </strong>
                <span
                  style={{
                    marginLeft: "10px",
                    color: "#888",
                    fontSize: "14px",
                  }}
                >
                  {message.senderEmail}
                </span>
              </div>
              <p
                style={{
                  marginBottom: "10px",
                  color: "#333",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  maxHeight: "200px", // Limits height for long text
                  overflow: "auto", // Adds scroll for overflowing text
                  paddingRight: "10px", // Prevents text from touching the edge
                }}
              >
                {message.recievedMessage}
              </p>
              <p
                style={{
                  marginBottom: "15px",
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                {formatTimestamp(message.timestamp)}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => toggleReadStatus(message._id, message.isRead)}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: message.isRead ? "#007BFF" : "#28A745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  {message.isRead ? "Mark as Unread" : "Mark as Read"}
                </button>
                <button
                  onClick={() => deleteMessage(message._id)}
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#FF4136",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessagesPage;
