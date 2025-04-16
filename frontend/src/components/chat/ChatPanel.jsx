import React, { useState } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage';

const ChatPanel = ({ sessionId, currentExerciseId }) => {
    const [messages, setMessages] = useState([
        { sender: 'assistant', text: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);

    const actionTypes = [
        { label: "Code", value: "AI_CODE_GENERATION" },
        { label: "Debug", value: "AI_DEBUG" },
        { label: "Theory", value: "AI_THEORY_EXPLANATION" },
        { label: "Query", value: "AI_GENERAL_QUERY" }
    ];

    const logInteraction = async (actionType, details) => {
        try {
            await axios.post('/api/log-interaction', {
                sessionId: sessionId,
                exerciseId: currentExerciseId,
                actionType: actionType,
                details: details
            });
        } catch (err) {
            console.error("Error logging interaction:", err);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !selectedAction) return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);

        await logInteraction(selectedAction, input);

        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('/api/chat', {
                message: currentInput,
                sessionId: sessionId,
                exerciseId: currentExerciseId,
                actionType: selectedAction
            });
            const replyMessage = { sender: 'assistant', text: response.data.reply };
            setMessages((prev) => [...prev, replyMessage]);
            await logInteraction(selectedAction, response.data.reply);
        } catch (err) {
            const errorMessage = {
                sender: 'assistant',
                text: 'Error: ' + (err.response?.data?.message || err.message)
            };
            setMessages((prev) => [...prev, errorMessage]);
            await logInteraction(selectedAction, errorMessage.text);
        }
        setLoading(false);
        setSelectedAction(null);
    };

    return (
        <div className="flex flex-col h-full bg-white p-4 border-l border-gray-300">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>

            {!selectedAction && (
                <div className="text-red-600 mb-1">*Please select the type of request you want to make:</div>
            )}
            <div className="flex items-center space-x-2 mb-1">
                {actionTypes.map((action) => (
                    <button
                        key={action.value}
                        onClick={() => setSelectedAction(action.value)}
                        className={`px-2 py-1 text-xs border rounded ${
                            selectedAction === action.value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                    >
                        {action.label}
                    </button>
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
                    disabled={!selectedAction}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-r"
                    disabled={!selectedAction || !input.trim()}
                >
                    Send
                </button>
            </div>

            {loading && <div className="text-sm text-gray-500 mt-2">Loading...</div>}
        </div>
    );
};

export default ChatPanel;
