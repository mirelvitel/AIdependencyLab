import React from 'react';
import CodeEditor from '../editor/CodeEditor';
import ChatPanel from '../chat/ChatPanel';

const TaskView = ({ task, onSubmit }) => {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-2xl font-bold mb-2">{task.title}</h3>
            <p className="mb-4 whitespace-pre-line">{task.description}</p>

            {task.testCases && task.testCases.length > 0 && (
                <div className="bg-gray-100 p-3 mb-4 rounded border border-gray-300">
                    <h4 className="font-semibold mb-2">Test Cases:</h4>
                    <ul className="list-disc pl-5">
                        {task.testCases.map((tc, idx) => (
                            <li key={idx}>{tc}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-4">
                <CodeEditor />
            </div>

            {task.isAIEnabled && (
                <div className="mb-4">
                    <ChatPanel />
                </div>
            )}

            <button
                onClick={onSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
                Submit Task
            </button>
        </div>
    );
};

export default TaskView;
