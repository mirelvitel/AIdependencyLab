import React, { useState } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage';

const ChatPanel = () => {
    const [messages, setMessages] = useState([
        { sender: 'assistant', text: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        // Add user's message.
        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        try {
            // Call your backend endpoint that interfaces with ChatGPT.
            const response = await axios.post('/api/chat', { message: input });
            const replyMessage = { sender: 'assistant', text: response.data.reply };
            setMessages((prev) => [...prev, replyMessage]);
        } catch (err) {
            const errorMessage = {
                sender: 'assistant',
                text: 'Error: ' + (err.response?.data?.message || err.message)
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-white p-4 border-l border-gray-300">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-l"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r">
                    Send
                </button>
            </div>
            {loading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}
        </div>
    );
};

export default ChatPanel;
