import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about BrokeBro." }
  ]);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("Checking server...");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // 🌙 toggle state

  const suggestions = [
    "What is BrokeBro?",
    "How can I contact support?",
    "What services do you offer?",
    "Where can I learn more about BrokeBro?",
  ];

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get("https://brochat-2cqd.onrender.com/health");
        setServerStatus(res.data.message || "Server is healthy");
      } catch (err) {
        console.error("Health check failed:", err);
        setServerStatus("Server is starting...");
      }
    };
    checkHealth();
  }, []);

  const handleSend = async (question) => {
    if (!question.trim()) return;
    setShowSuggestions(false);

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post("https://brochat-2cqd.onrender.com/chat", { query: question });
      const botMessage = { sender: "bot", text: res.data.answer || "Sorry, no response." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("API Error:", err);
      const botMessage = { sender: "bot", text: "Failed to get response from server." };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="chat-container"
      style={{
        background: darkMode ? "#1e1e1e" : "#f4f4f4",
        color: darkMode ? "white" : "black",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px"
      }}
    >
      {/* Toggle button for Dark Mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          marginBottom: "10px",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          background: darkMode ? "#f4f4f4" : "#333",
          color: darkMode ? "#333" : "white",
          fontWeight: "bold"
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Chat window */}
      <ChatWindow messages={messages} loading={loading} darkMode={darkMode} />

      {/* Suggested Questions */}
      {showSuggestions && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "10px" }}>
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              style={{
                padding: "8px 14px",
                borderRadius: "20px",
                border: "none",
                background: darkMode ? "#444" : "skyblue",
                cursor: "pointer",
                fontSize: "14px",
                color: darkMode ? "white" : "black",
                fontWeight: "500",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat input */}
      <ChatInput onSend={handleSend} darkMode={darkMode} />

      {/* Server status */}
      <div style={{
        marginTop: "8px",
        fontSize: "12px",
        color: serverStatus.includes("healthy") ? "green" : "orange"
      }}>
        {serverStatus}
      </div>
    </div>
  );
};

export default App;
