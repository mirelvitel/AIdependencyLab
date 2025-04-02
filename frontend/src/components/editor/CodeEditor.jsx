import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import LanguageSelector from './LanguageSelector';
import LANGUAGE_SKELETONS from '../skeleton';

const CodeEditor = () => {
    const [language, setLanguage] = useState('java');
    const [code, setCode] = useState(LANGUAGE_SKELETONS.java);
    const [output, setOutput] = useState('');

    const handleEditorChange = (value, event) => {
        setCode(value);
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        setCode(LANGUAGE_SKELETONS[newLanguage]);
        setOutput('');
    };

    const handleRunCode = async () => {
        try {
            setOutput('Running...');
            const response = await axios.post('/api/run', {
                language,
                code
            });
            setOutput(response.data.output || 'No output received');
        } catch (err) {
            setOutput(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <LanguageSelector
                language={language}
                onLanguageChange={handleLanguageChange}
            />

            <div style={{ height: '400px' }}>
                <Editor
                    height="100%"
                    language={language}
                    theme="light"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14
                    }}
                />
            </div>

            <div className="mt-4 flex gap-4">
                <button
                    onClick={handleRunCode}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Run Code
                </button>
            </div>

            {/* Output Section */}
            <div className="mt-4 bg-gray-200 p-2 rounded">
                <h3 className="font-semibold mb-2">Output:</h3>
                <pre className="whitespace-pre-wrap">
                    {output}
                </pre>
            </div>
        </div>
    );
};

export default CodeEditor;
