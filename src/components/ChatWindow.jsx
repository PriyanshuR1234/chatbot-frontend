import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const formatText = (text, darkMode) => {
  return text.split("\n").map((line, i) => {
    if (line.trim().startsWith("##")) {
      return (
        <div key={i} style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0 6px", color: "#0078ff" }}>
          {line.replace(/^##\s*/, "")}
        </div>
      );
    } else if (line.includes("**")) {
      return (
        <div key={i} style={{ margin: "4px 0", fontSize: "15px", lineHeight: "1.5" }}>
          {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <span key={j} style={{ fontWeight: "bold", color: darkMode ? "#e0e0e0" : "#333" }}>
                {part.replace(/\*\*/g, "")}
              </span>
            ) : (
              part
            )
          )}
        </div>
      );
    }
    return (
      <div key={i} style={{ fontSize: "14px", margin: "4px 0", lineHeight: "1.6" }}>
        {line}
      </div>
    );
  });
};

const ChatWindow = ({ messages, darkMode, loading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "600px",
        padding: "12px",
        borderRadius: "12px",
        background: darkMode ? "#1e1e1e" : "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginBottom: "15px",
        height: "65vh",          // ✅ FIXED HEIGHT
        overflowY: "auto",       // ✅ Always scrollable
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.map((msg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
            margin: "6px 0",
            padding: "12px 16px",
            borderRadius: "14px",
            maxWidth: "80%",
            background:
              msg.sender === "user"
                ? darkMode
                  ? "#4a90e2"
                  : "#0078ff"
                : darkMode
                ? "#2b3a42"
                : "#f0f8ff",
            color: msg.sender === "user" ? "white" : darkMode ? "white" : "black",
          }}
        >
          {msg.sender === "bot" ? formatText(msg.text, darkMode) : msg.text}
        </motion.div>
      ))}
      {loading && <div style={{ margin: "8px", fontSize: "14px" }}>⏳ Typing...</div>}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
