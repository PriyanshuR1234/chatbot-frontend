import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Ask me anything about your notes." }
  ]);

  const handleSend = async (question) => {
    // Add user message
    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Make API call to backend
      const res = await axios.post("https://chatbot-ksbz.onrender.com/ask", { question });

      const botMessage = { sender: "bot", text: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const botMessage = { sender: "bot", text: "Failed to get response from server." };
      setMessages((prev) => [...prev, botMessage]);
      console.error("API Error:", err);
    }
  };

  return (
    <div className="chat-container">
      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default App;
