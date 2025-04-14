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
        { label: "Generate Code", value: "AI_CODE_GENERATION" },
        { label: "Debug Code", value: "AI_DEBUG" },
        { label: "Explain Theory", value: "AI_THEORY_EXPLANATION" },
        { label: "General Query", value: "AI_GENERAL_QUERY" }
    ];

    const logInteraction = async (actionType, details) => {
        console.log("Logging interaction:", { sessionId, currentExerciseId, actionType, details });
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
    };

    return (
        <div className="flex flex-col h-full bg-white p-4 border-l border-gray-300">
            {!selectedAction && (
                <div className="mb-4">
                    <p className="mb-2 font-semibold">Select query type:</p>
                    <div className="flex gap-2">
                        {actionTypes.map((action) => (
                            <button
                                key={action.value}
                                onClick={() => setSelectedAction(action.value)}
                                className={`px-3 py-1 border rounded ${
                                    selectedAction === action.value
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

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
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                    placeholder={selectedAction ? "Type your message..." : "Select a query type above to enable chat"}
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
