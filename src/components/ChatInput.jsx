import React, { useState } from "react";

const ChatInput = ({ onSend, darkMode }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      className="chat-input"
      style={{
        display: "flex",
        gap: "8px",
        marginTop: "10px",
        width: "100%",
        maxWidth: "600px"
      }}
    >
      <input
        type="text"
        placeholder="Type your question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          background: darkMode ? "#2b2b2b" : "white",
          color: darkMode ? "white" : "black"
        }}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          background: darkMode ? "#555" : "skyblue",
          color: darkMode ? "white" : "black",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
