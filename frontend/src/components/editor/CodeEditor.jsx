import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import SKELETONS, { TASK_FN_MAP } from "../skeletons";

const CodeEditor = ({ task, exerciseId }) => {
    const fnKey = TASK_FN_MAP[task.title];
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');

    useEffect(() => {
        const stub = SKELETONS.java[fnKey] || '';
        setCode(stub);
        setOutput('');
    }, [fnKey]);

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const handleRunCode = async () => {
        setOutput('Running…');
        try {
            const { data } = await axios.post('/api/run', {
                language: 'java',
                code,
                taskId: task.taskId,
                exerciseId: exerciseId
            });

            if (data.syntaxError) {
                setOutput(data.syntaxError);
            } else {
                const lines = data.testResults.map(tr =>
                    `Input: ${tr.stdin}\nExpected: ${tr.expected}\nActual:   ${tr.stdout}\nStatus:   ${tr.status}`
                );
                setOutput(lines.join('\n\n') + `\n\nAll passed: ${data.allPassed}`);
            }
        } catch (err) {
            setOutput(`Error: ${err.response?.data || err.message}`);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div style={{ height: 400 }}>
                <Editor
                    height="100%"
                    language="java"
                    theme="light"
                    value={code}
                    onChange={handleEditorChange}
                    options={{ minimap: { enabled: false }, fontSize: 14 }}
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

            <div className="mt-4 bg-gray-200 p-2 rounded max-h-64 overflow-y-auto">
                <h3 className="font-semibold mb-2">Output:</h3>
                <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;
