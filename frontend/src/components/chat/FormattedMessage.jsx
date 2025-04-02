import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FormattedMessage = ({ text }) => {
    if (!text.includes('```')) {
        return <p>{text}</p>;
    }

    const parts = text.split(/```/);
    return (
        <>
            {parts.map((part, index) => {
                if (index % 2 === 1) {
                    const lines = part.split('\n');
                    let language = '';
                    if (lines.length > 1 && lines[0].trim() !== '') {
                        language = lines[0].trim();
                        part = lines.slice(1).join('\n');
                    }
                    return (
                        <SyntaxHighlighter language={language || 'text'} style={coy} key={index}>
                            {part}
                        </SyntaxHighlighter>
                    );
                } else {
                    return <p key={index}>{part}</p>;
                }
            })}
        </>
    );
};

export default FormattedMessage;
