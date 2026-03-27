import React from 'react';

const TestTasksPanel = ({ task, currentTaskIndex, totalTasks, onSubmit }) => {
    if (!task) {
        return <div className="p-4">No task available. Please restart the test.</div>;
    }

    let testCasesArray = task.testCases;
    if (typeof task.testCases === 'string') {
        testCasesArray = task.testCases.split('|');
    }

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden shadow-md">

            {/* Header */}
            <div className="bg-gray-700 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Progress</p>
                    <p className="text-lg font-bold leading-tight">
                        Task <span className="text-white">{currentTaskIndex + 1}</span>
                        <span className="text-gray-400 font-normal"> / {totalTasks}</span>
                    </p>
                </div>
                {task.isAIEnabled ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500 text-white">
                        AI Enabled
                    </span>
                ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white">
                        No AI
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-200 flex-shrink-0">
                <div
                    className="h-1 bg-gray-500 transition-all duration-300"
                    style={{ width: `${((currentTaskIndex + 1) / totalTasks) * 100}%` }}
                />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                    <h3 className="text-base font-bold text-gray-800">{task.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                        {task.description}
                    </p>
                </div>

                {testCasesArray && testCasesArray.length > 0 && (
                    <div className="rounded-md border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Test Cases
                            </h4>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            {testCasesArray.map((tc, i) => (
                                <li key={i} className="px-3 py-2 text-sm text-gray-700 font-mono">
                                    {tc}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={onSubmit}
                    className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
                >
                    {currentTaskIndex === totalTasks - 1 ? 'Submit Test' : 'Submit Task →'}
                </button>
            </div>
        </div>
    );
};

export default TestTasksPanel;
