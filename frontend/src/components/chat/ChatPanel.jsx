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
        { label: "Code Generation", value: "AI_CODE_GENERATION" },
        { label: "Debug", value: "AI_DEBUG" },
        { label: "Theory", value: "AI_THEORY_EXPLANATION" },
        { label: "General Query", value: "AI_GENERAL_QUERY" }
    ];

    const logInteraction = async (actionType, details) => {
        try {
            await axios.post('/api/log-interaction', {
                sessionId,
                exerciseId: currentExerciseId,
                actionType,
                details
            });
        } catch (err) {
            console.error("Error logging interaction:", err);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !selectedAction) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        await logInteraction(selectedAction, input);

        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('/api/chat', {
                message: currentInput,
                sessionId,
                exerciseId: currentExerciseId,
                actionType: selectedAction
            });
            const replyMessage = { sender: 'assistant', text: response.data.reply };
            setMessages(prev => [...prev, replyMessage]);
            await logInteraction(selectedAction, response.data.reply);
        } catch (err) {
            const errorMessage = {
                sender: 'assistant',
                text: 'Error: ' + (err.response?.data?.message || err.message)
            };
            setMessages(prev => [...prev, errorMessage]);
            await logInteraction(selectedAction, errorMessage.text);
        } finally {
            setLoading(false);
            setSelectedAction(null);
        }
    };

    return (
        <div className="relative flex flex-col h-full bg-white p-2 border-l border-gray-300 overflow-hidden text-sm">
            <div className="flex-1 overflow-y-auto mb-2 break-words">
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        sender={msg.sender}
                        text={msg.text}
                        className="whitespace-pre-wrap break-words"
                    />
                ))}
            </div>

            {!selectedAction && (
                <div className="text-red-600 mb-1 text-xs">
                    *Please select the type of request you want to make:
                </div>
            )}

            <div className="flex items-center space-x-1 mb-1 text-xs">
                {actionTypes.map(action => (
                    <button
                        key={action.value}
                        onClick={() => setSelectedAction(action.value)}
                        className={`px-2 py-1 border rounded ${
                            selectedAction === action.value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        {action.label}
                    </button>
                ))}
            </div>

            <div className="flex">
                <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-l text-sm"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                    placeholder="Type your message..."
                    disabled={!selectedAction}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-r text-sm"
                    disabled={!selectedAction || !input.trim()}
                >
                    Send
                </button>
            </div>

            {loading && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-20 space-y-2">
                    <svg
                        className="animate-spin h-6 w-6 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                    <span className="text-sm text-gray-700">Thinking …</span>
                </div>
            )}
        </div>
    );
};

export default ChatPanel;
