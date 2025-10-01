import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Function to format response text into styled JSX
const formatText = (text, darkMode) => {
  // Split by line breaks
  return text.split("\n").map((line, i) => {
    // Headings: lines starting with ##
    if (line.trim().startsWith("##")) {
      return (
        <div
          key={i}
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: "8px 0 4px",
            color: darkMode ? "#aad4ff" : "#0056a3",
          }}
        >
          {line.replace(/^##\s*/, "")}
        </div>
      );
    }
    // Subheadings: **text**
    else if (line.includes("**")) {
      return (
        <div key={i} style={{ margin: "4px 0" }}>
          {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <span
                  key={j}
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: darkMode ? "#e0e0e0" : "#333",
                  }}
                >
                  {part.replace(/\*\*/g, "")}
                </span>
              );
            }
            return part;
          })}
        </div>
      );
    }
    // Normal text
    else {
      return (
        <div
          key={i}
          style={{
            fontSize: "14px",
            margin: "2px 0",
            lineHeight: "1.4",
          }}
        >
          {line}
        </div>
      );
    }
  });
};

const ChatWindow = ({ messages, darkMode }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="chat-messages"
      style={{
        width: "100%",
        maxWidth: "600px",
        padding: "15px",
        borderRadius: "12px",
        background: darkMode ? "#1e1e1e" : "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginBottom: "15px",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column"
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
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            background:
              msg.sender === "user"
                ? darkMode
                  ? "#4a90e2"
                  : "#0078ff"
                : darkMode
                ? "#2b3a42" // ✅ dark mode bot bubble
                : "#eaf6ff", // ✅ light sky-blue in light mode
            color:
              msg.sender === "user"
                ? "white"
                : darkMode
                ? "white"
                : "black",
          }}
        >
          {msg.sender === "bot" ? formatText(msg.text, darkMode) : msg.text}
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
