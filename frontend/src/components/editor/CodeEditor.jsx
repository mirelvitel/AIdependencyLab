// src/components/editor/CodeEditor.jsx
import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import SKELETONS, { TASK_FN_MAP } from "../skeletons";

const CodeEditor = ({ task, exerciseId }) => {
    const fnKey = TASK_FN_MAP[task.title];
    const [code, setCode] = useState('');
    const [syntaxError, setSyntaxError] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [allPassed, setAllPassed] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stub = SKELETONS.java[fnKey] || '';
        setCode(stub);
        setSyntaxError('');
        setTestResults([]);
        setAllPassed(null);
    }, [fnKey]);

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const handleRunCode = async () => {
        // reset
        setSyntaxError('');
        setTestResults([]);
        setAllPassed(null);
        setLoading(true);

        try {
            const { data } = await axios.post('/api/run', {
                language: 'java',
                code,
                taskId: task.taskId,
                exerciseId: exerciseId
            });

            if (data.syntaxError) {
                setSyntaxError(data.syntaxError);
            } else {
                setTestResults(data.testResults);
                setAllPassed(data.allPassed);
            }
        } catch (err) {
            setSyntaxError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div style={{ height: 700 }}>
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
                    disabled={loading}
                >
                    {loading ? 'Running…' : 'Run Code'}
                </button>
            </div>

            <div className="mt-4 bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
                {/* Pass/Fail summary */}
                {allPassed != null && (
                    <div
                        className={`mb-4 text-lg font-semibold ${
                            allPassed ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {allPassed ? 'All tests passed!' : 'Some tests failed.'}
                    </div>
                )}

                {/* Syntax error or test case details */}
                {syntaxError ? (
                    <pre className="text-red-600 whitespace-pre-wrap">{syntaxError}</pre>
                ) : (
                    testResults.map((tr, idx) => (
                        <div
                            key={idx}
                            className="mb-3 p-3 border rounded flex justify-between items-start bg-white"
                        >
                            <div className="flex-1 space-y-1 text-sm">
                                <div>
                                    <span className="font-semibold">Input:</span> {tr.stdin}
                                </div>
                                <div>
                                    <span className="font-semibold">Expected:</span> {tr.expected}
                                </div>
                                <div>
                                    <span className="font-semibold">Actual:</span> {tr.stdout}
                                </div>
                            </div>
                            <div
                                className={`ml-4 mt-1 font-bold ${
                                    tr.status === 'passed' ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {tr.status.toUpperCase()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CodeEditor;
