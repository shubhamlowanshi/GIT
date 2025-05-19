import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m your assistant. How can I help you today?' },
  ]);
  const [userInput, setUserInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!userInput.trim()) return;
    const userMessage = { from: 'user', text: userInput };

    const botMessage = {
      from: 'bot',
      text: getBotResponse(userInput),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setUserInput('');
  };

  const getBotResponse = (input) => {
    const lower = input.toLowerCase();
    if (lower.includes('register')) return 'Click on the Register button in the navbar and fill your details.';
    if (lower.includes('login')) return 'Click Login and enter your email and password.';
    if (lower.includes('profile')) return 'Visit your Profile from the navbar to view your information.';
    if (lower.includes('cart')) return 'Click the Cart icon to see your selected items.';
    return 'Sorry, I\'m still learning. Try asking about "register", "profile", or "cart".';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white w-72 h-96 shadow-lg rounded-lg flex flex-col overflow-hidden border border-gray-300">
          <div className="bg-blue-600 text-white p-3 font-semibold">SupportBot</div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm p-2 rounded ${msg.from === 'bot' ? 'bg-gray-100 text-left' : 'bg-blue-100 text-right'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-2 py-1 border rounded-l outline-none text-sm"
              placeholder="Ask something..."
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-3 rounded-r">Send</button>
          </div>
        </div>
      )}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FaRobot size={20} />
      </button>
    </div>
  );
};

export default SupportBot;
