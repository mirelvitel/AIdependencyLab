import React from 'react';
import FormattedMessage from './FormattedMessage';

const ChatMessage = ({ sender, text }) => {
    const alignment = sender === 'user' ? 'text-right' : 'text-left';
    const bgColor = sender === 'user' ? 'bg-blue-200' : 'bg-gray-200';

    return (
        <div className={`mb-2 ${alignment}`}>
            <div className={`inline-block p-2 rounded ${bgColor}`}>
                <FormattedMessage text={text} />
            </div>
        </div>
    );
};

export default ChatMessage;
