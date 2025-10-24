import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Welcome to **BrokeBro Chatbot**!\n\nAsk me anything about BrokeBro 🚀" }
  ]);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("Checking server...");
  const [darkMode, setDarkMode] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);

  const suggestions = [
    "What is BrokeBro?",
    "How can I contact support?",
    "What services do you offer?",
    "Where can I learn more about BrokeBro?",
  ];

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get("https://brochat-f.onrender.com/health");
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

    // 🚀 Hide suggestions once a user clicks anything
    setSuggestionsVisible(false);

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post("https://brochat-f.onrender.com/chat", { query: question });
      const botMessage = { sender: "bot", text: res.data.answer || "Sorry, no response." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("API Error:", err);
      const botMessage = { sender: "bot", text: "⚠️ Failed to get response from server." };
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
        padding: "20px",
      }}
    >
      {/* HEADER BAR */}
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <img
          src="/logo.png"
          alt="BrokeBro Logo"
          style={{
            width: "120px",
            height: "45px",
            objectFit: "contain",
            cursor: "pointer",
          }}
        />

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: darkMode ? "#f4f4f4" : "#333",
            color: darkMode ? "#333" : "white",
            fontWeight: "bold",
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Chat window */}
      <ChatWindow messages={messages} loading={loading} darkMode={darkMode} />

      {/* Suggested Questions (show only until first click) */}
      {suggestionsVisible && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            margin: "10px",
            justifyContent: "center",
          }}
        >
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
                transition: "0.3s",
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
      <div
        style={{
          alignSelf: "flex-start",
          marginTop: "12px",
          marginLeft: "5%",
          fontSize: "12px",
          fontWeight: "500",
          color: serverStatus.includes("healthy") ? "green" : "orange",
        }}
      >
        {serverStatus}
      </div>
    </div>
  );
};

export default App;
