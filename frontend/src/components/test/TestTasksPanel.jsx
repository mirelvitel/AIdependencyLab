import React from 'react';

const TestTasksPanel = ({ task, currentTaskIndex, totalTasks, onSubmit }) => {
    if (!task) {
        return <div className="p-4">No task available. Please restart the test.</div>;
    }
    return (
        <div className="h-full p-4 bg-white overflow-y-auto shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-2">
                Task {currentTaskIndex + 1} of {totalTasks}
            </h2>
            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
            <p className="whitespace-pre-line mb-4">{task.description}</p>

            {task.testCases && task.testCases.length > 0 && (
                <div className="bg-gray-200 p-3 mt-4 rounded border border-gray-400">
                    <h4 className="font-semibold mb-2">Test Cases:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        {task.testCases.map((tc, i) => (
                            <li key={i} className="text-sm">{tc}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={onSubmit}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit Task
                </button>
            </div>
        </div>
    );
};

export default TestTasksPanel;
