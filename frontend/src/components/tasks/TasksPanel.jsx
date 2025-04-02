import React from 'react';
import tasksWithoutAI from '../../tasksWithoutAI';

const TasksPanel = ({ currentTaskIndex, setCurrentTaskIndex }) => {
    const totalTasks = tasksWithoutAI.length;
    const task = tasksWithoutAI[currentTaskIndex];

    const handlePrev = () => {
        if (currentTaskIndex > 0) {
            setCurrentTaskIndex(currentTaskIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentTaskIndex < totalTasks - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1);
        }
    };

    return (
        <div className="h-full p-4 bg-white overflow-y-auto shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-2">
                Task {currentTaskIndex + 1} of {totalTasks}
            </h2>
            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
            <p className="whitespace-pre-line">
                {task.description}
            </p>

            {task.testCases && task.testCases.length > 0 && (
                <div className="bg-gray-100 p-3 mt-4 rounded border border-gray-300">
                    <h4 className="font-semibold mb-2">Test Cases:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        {task.testCases.map((tc, i) => (
                            <li key={i} className="text-sm">
                                {tc}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6 flex justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentTaskIndex === 0}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentTaskIndex === totalTasks - 1}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TasksPanel;
