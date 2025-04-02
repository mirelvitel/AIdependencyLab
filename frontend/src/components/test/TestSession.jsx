// src/components/test/TestSession.jsx
import React, { useState, useEffect } from 'react';
import TaskView from './TaskView';
import tasksWithAI from '../../tasksWithAI';
import tasksWithoutAI from '../../tasksWithoutAI';

const TestSession = ({ onFinish }) => {
    // 1 hour = 3600 seconds
    const [timeLeft, setTimeLeft] = useState(3600);
    // Build ordered tasks: interleaving AI-enabled and non-AI tasks.
    const orderedTasks = [];
    for (let i = 0; i < tasksWithAI.length; i++) {
        orderedTasks.push(tasksWithAI[i]);
        if (i < tasksWithoutAI.length) {
            orderedTasks.push(tasksWithoutAI[i]);
        }
    }
    const totalTasks = orderedTasks.length;
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Timer: count down every second.
    useEffect(() => {
        if (timeLeft <= 0) {
            // Time's up; finish the test.
            onFinish();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onFinish]);

    // Called when the user submits the current task.
    const handleTaskSubmit = () => {
        if (currentTaskIndex < totalTasks - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1);
        } else {
            // All tasks completed; finish the test.
            onFinish();
        }
    };

    // Manual test submission button handler.
    const handleSubmitTest = () => {
        onFinish();
    };

    // Format timer (minutes:seconds)
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    Task {currentTaskIndex + 1} of {totalTasks}
                </h2>
                <span className="font-semibold">
          Time Left: {minutes}:{seconds < 10 ? '0' : ''}{seconds}
        </span>
            </div>

            <TaskView
                task={orderedTasks[currentTaskIndex]}
                onSubmit={handleTaskSubmit}
            />

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleSubmitTest}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Submit Test
                </button>
            </div>
        </div>
    );
};

export default TestSession;
