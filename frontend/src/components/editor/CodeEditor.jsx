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
            const data = err.response?.data;
            setSyntaxError(typeof data === 'string' ? data : data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div style={{ height: 600 }}>
                <Editor
                    height="100%"
                    language="java"
                    theme="light"
                    value={code}
                    onChange={handleEditorChange}
                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                />
            </div>

            <div className="mt-4 flex gap-4 items-center">
                <button
                    onClick={handleRunCode}
                    className={`flex items-center gap-2 text-white font-bold py-2 px-6 rounded transition-colors ${
                        loading
                            ? 'bg-green-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                    }`}
                    disabled={loading}
                >
                    {loading && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                    {loading ? 'Running…' : 'Run Code'}
                </button>
            </div>

            <div className="mt-4 bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
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
