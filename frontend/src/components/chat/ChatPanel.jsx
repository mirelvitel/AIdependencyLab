// src/components/chat/ChatPanel.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage';

const ChatPanel = ({ sessionId, currentExerciseId }) => {
    const [messages, setMessages] = useState([
        { sender: 'assistant', text: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

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

    useEffect(() => {
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = 'auto';
            ta.style.height = `${ta.scrollHeight}px`;
        }
    }, [input]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="relative flex flex-col h-full bg-white overflow-hidden text-sm">

            {/* Header */}
            <div className="bg-gray-700 text-white px-4 py-3 flex-shrink-0">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Assistant</p>
                <p className="font-bold leading-tight">AI Chat</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 break-words">
                {messages.map((msg, idx) => (
                    <ChatMessage
                        key={idx}
                        sender={msg.sender}
                        text={msg.text}
                        className="whitespace-pre-wrap break-words"
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-3 pt-2 pb-3 space-y-2">
                {/* Action type buttons */}
                <div>
                    {!selectedAction && (
                        <p className="text-xs text-red-500 mb-1">Select a request type before sending:</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                        {actionTypes.map(action => (
                            <button
                                key={action.value}
                                onClick={() => setSelectedAction(action.value)}
                                className={`px-2 py-1 rounded text-xs font-medium border transition-colors duration-100 ${
                                    selectedAction === action.value
                                        ? 'bg-gray-700 text-white border-gray-700'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text input + send */}
                <div className="flex gap-2 items-end">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        className="flex-1 p-2 border border-gray-300 rounded text-sm resize-none overflow-hidden focus:outline-none focus:border-gray-500"
                        style={{ maxHeight: '8rem', minHeight: '2.25rem' }}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder={selectedAction ? "Type your message…" : "Select a type first…"}
                        disabled={!selectedAction}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!selectedAction || !input.trim()}
                        className="bg-gray-700 hover:bg-gray-800 disabled:opacity-40 text-white px-3 py-2 rounded text-sm font-semibold transition-colors duration-150"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-20 space-y-2">
                    <svg
                        className="animate-spin h-6 w-6 text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-sm text-gray-600">Thinking…</span>
                </div>
            )}
        </div>
    );
};

export default ChatPanel;
