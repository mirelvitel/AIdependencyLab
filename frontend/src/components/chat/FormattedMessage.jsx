import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';

const CodeBlock = ({ language, value }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div className="relative mb-6">
            <button
                onClick={copyToClipboard}
                aria-label="Copy code"
                className="absolute top-2 right-2 p-1 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none"
            >
                {copied
                    ? <FiCheck className="w-5 h-5 text-green-600" />
                    : <FiCopy className="w-5 h-5 text-gray-600" />
                }
            </button>
            <SyntaxHighlighter
                language={language || 'text'}
                style={coy}
                customStyle={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: '0.9rem',
                }}
                showLineNumbers
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

const FormattedMessage = ({ text }) => {
    const parts = text.split(/```/);

    return (
        <div>
            {parts.map((part, index) => {
                if (index % 2 === 1) {
                    const lines = part.split('\n');
                    let language = '';
                    let code = part;

                    if (lines.length > 1 && lines[0].trim() !== '') {
                        language = lines[0].trim();
                        code = lines.slice(1).join('\n');
                    }

                    return (
                        <CodeBlock
                            key={`code-${index}`}
                            language={language}
                            value={code}
                        />
                    );
                }

                return (
                    <p
                        key={`text-${index}`}
                        className="mb-4 text-gray-800 leading-relaxed whitespace-pre-line"
                    >
                        {part}
                    </p>
                );
            })}
        </div>
    );
};

export default FormattedMessage;
