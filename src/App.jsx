import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about BrokeBro." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (question) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Call Flask backend
      const res = await axios.post("https://brochat-2cqd.onrender.com/chat", { query: question });

      // Add bot response
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
    <div className="chat-container">
      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default App;
