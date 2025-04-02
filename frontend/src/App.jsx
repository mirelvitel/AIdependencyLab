// src/App.jsx
import React, { useState, useEffect } from 'react';
import './index.css';
import CodeEditor from './components/editor/CodeEditor';
import ChatPanel from './components/chat/ChatPanel';
import IntroScreen from './components/intro/IntroScreen';
import TestTasksPanel from './components/test/TestTasksPanel';
import SurveyForm from './components/survey/SurveyForm';
import tasksWithoutAI from './tasksWithoutAI';
import tasksWithAI from './tasksWithAI';

const App = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const [currentPanel, setCurrentPanel] = useState("task");
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [orderedTasks, setOrderedTasks] = useState([]);
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
    const [testSubmitted, setTestSubmitted] = useState(false);
    const [surveySubmitted, setSurveySubmitted] = useState(false);

    // Build interleaved tasks with isAIEnabled property
    useEffect(() => {
        if (hasStarted) {
            const ordered = [];
            const max = Math.max(tasksWithAI.length, tasksWithoutAI.length);
            for (let i = 0; i < max; i++) {
                if (i < tasksWithAI.length) {
                    ordered.push({ ...tasksWithAI[i], isAIEnabled: true });
                }
                if (i < tasksWithoutAI.length) {
                    ordered.push({ ...tasksWithoutAI[i], isAIEnabled: false });
                }
            }
            setOrderedTasks(ordered);
        }
    }, [hasStarted]);

    // Timer countdown effect.
    useEffect(() => {
        if (!hasStarted || testSubmitted) return;
        if (timeLeft <= 0) {
            handleTestSubmitAndRedirect();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, hasStarted, testSubmitted]);

    // Toggle left/right panels.
    const togglePanel = (panel) => {
        setCurrentPanel(currentPanel === panel ? null : panel);
    };

    // Handle task submission.
    const handleTaskSubmit = () => {
        // For non-final tasks, show one confirmation.
        if (currentTaskIndex < orderedTasks.length - 1) {
            const confirmed = window.confirm("Once submitted, you cannot come back to this task. Are you sure?");
            if (!confirmed) return;
            setCurrentTaskIndex(currentTaskIndex + 1);
            setCurrentPanel("task");
        } else {
            // For the final task, confirm test submission.
            const confirmed = window.confirm("Are you sure you want to submit the test?");
            if (confirmed) {
                handleTestSubmitAndRedirect();
            }
        }
    };

    // Handle overall test submission and redirect to survey.
    const handleTestSubmitAndRedirect = () => {
        setTestSubmitted(true);
    };

    if (testSubmitted && !surveySubmitted) {
        return (
            <SurveyForm
                onSubmit={(data) => {
                    console.log("Survey submitted:", data);
                    setSurveySubmitted(true);
                }}
            />
        );
    }

    if (surveySubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold">Thank you for your participation!</h2>
            </div>
        );
    }

    const currentTask = orderedTasks[currentTaskIndex];
    const isChatEnabled = currentTask && currentTask.isAIEnabled;
    const editorWidthClass = currentPanel ? "w-3/4" : "w-full";

    if (!hasStarted) {
        return <IntroScreen onStart={() => setHasStarted(true)} />;
    }

    return (
        <div className="App bg-gray-100 min-h-screen flex flex-col relative">
            <header className="bg-gray-600 text-white py-4 shadow-md flex justify-between items-center px-4">
                <h1 className="text-3xl font-bold">AIdependencyLab</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-lg">
                        Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
                    </div>
                    <button
                        onClick={() => {
                            const confirmed = window.confirm("Are you sure you want to submit the test?");
                            if (confirmed) {
                                handleTestSubmitAndRedirect();
                            }
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit Test
                    </button>
                </div>
            </header>

            <main className="flex flex-1 relative">
                {currentPanel === "task" && (
                    <div className="w-1/4 border-r border-gray-300">
                        <TestTasksPanel
                            task={currentTask}
                            currentTaskIndex={currentTaskIndex}
                            totalTasks={orderedTasks.length}
                            onSubmit={handleTaskSubmit}
                        />
                    </div>
                )}

                <div className={editorWidthClass}>
                    <CodeEditor />
                </div>

                {currentPanel === "chat" && isChatEnabled && (
                    <div className="w-1/4 border-l border-gray-300">
                        <ChatPanel />
                    </div>
                )}
            </main>

            <div
                className={`absolute top-1/2 transform -translate-y-1/2 z-20 ${currentPanel === "task" ? "left-[25%]" : "left-0"}`}
            >
                <button
                    onClick={() => togglePanel("task")}
                    className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-r focus:outline-none"
                >
                    {currentPanel === "task" ? (
                        <span>&lt;</span>
                    ) : (
                        <>
                            <span>Tasks</span>
                            <span className="ml-2">&gt;</span>
                        </>
                    )}
                </button>
            </div>

            {isChatEnabled && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20">
                    <button
                        onClick={() => togglePanel("chat")}
                        className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-l focus:outline-none"
                    >
                        {currentPanel === "chat" ? (
                            <span>&gt;</span>
                        ) : (
                            <>
                                <span className="mr-2">&lt;</span>
                                <span>ChatGPT</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            <footer className="text-center text-gray-600 py-4">
                &copy; {new Date().getFullYear()} AIdependencyLab
            </footer>
        </div>
    );
};

export default App;
