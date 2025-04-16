import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import CodeEditor from './components/editor/CodeEditor';
import ChatPanel from './components/chat/ChatPanel';
import IntroScreen from './components/intro/IntroScreen';
import TestTasksPanel from './components/test/TestTasksPanel';
import SurveyForm from './components/survey/SurveyForm';

const App = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const [session, setSession] = useState(null);
    const [currentPanel, setCurrentPanel] = useState("task");
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [orderedTasks, setOrderedTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [timeLeft, setTimeLeft] = useState(3600);
    const [testSubmitted, setTestSubmitted] = useState(false);
    const [surveySubmitted, setSurveySubmitted] = useState(false);
    const [currentExerciseId, setCurrentExerciseId] = useState(null);

    useEffect(() => {
        axios.get('/api/tasks')
            .then(response => setAllTasks(response.data))
            .catch(err => console.error("Error fetching tasks:", err));
    }, []);

    useEffect(() => {
        if (hasStarted && allTasks.length > 0) {
            const tasksWithAI = allTasks.filter(t => t.isAIEnabled);
            const tasksWithoutAI = allTasks.filter(t => !t.isAIEnabled);
            const ordered = [];
            const max = Math.max(tasksWithAI.length, tasksWithoutAI.length);
            for (let i = 0; i < max; i++) {
                if (i < tasksWithAI.length) ordered.push({ ...tasksWithAI[i] });
                if (i < tasksWithoutAI.length) ordered.push({ ...tasksWithoutAI[i] });
            }
            setOrderedTasks(ordered);
        }
    }, [hasStarted, allTasks]);

    useEffect(() => {
        if (!hasStarted || testSubmitted) return;
        if (timeLeft <= 0) {
            handleTestSubmitAndRedirect();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, hasStarted, testSubmitted]);

    useEffect(() => {
        if (hasStarted && orderedTasks.length > 0 && session) {
            const currentTask = orderedTasks[currentTaskIndex];
            const taskId = currentTask.id || currentTask.taskId;
            axios.post('/api/exercise/start', {
                sessionId: session.sessionId,
                taskId: taskId
            })
                .then(response => setCurrentExerciseId(response.data.exerciseId))
                .catch(err => console.error("Error starting exercise:", err));
        }
    }, [currentTaskIndex, hasStarted, orderedTasks, session]);

    const handleTaskSubmit = async () => {
        const isLast = currentTaskIndex === orderedTasks.length - 1;
        const confirmMsg = isLast
            ? "Are you sure you want to submit the test?"
            : "Once submitted, you cannot come back to this task. Are you sure?";
        if (!window.confirm(confirmMsg)) return;
        try {
            await axios.post('/api/exercise/complete', {
                exerciseId: currentExerciseId,
                completionTime: String(3600 - timeLeft),
                isAIEnabled: orderedTasks[currentTaskIndex].isAIEnabled
            });
        } catch (error) {
            console.error("Error completing exercise:", error);
        }
        if (isLast) {
            handleTestSubmitAndRedirect();
        } else {
            setCurrentTaskIndex(idx => idx + 1);
            setCurrentPanel("task");
        }
    };

    const handleTestSubmitAndRedirect = async () => {
        if (session?.sessionId) {
            try {
                await axios.post('/api/end-session', { sessionId: session.sessionId });
            } catch (error) {
                console.error("Error ending session:", error);
            }
        }
        setTestSubmitted(true);
    };

    const togglePanel = panel =>
        setCurrentPanel(cur => (cur === panel ? null : panel));

    if (testSubmitted && !surveySubmitted) {
        return (
            <SurveyForm
                sessionId={session.sessionId}
                onSubmit={() => setSurveySubmitted(true)}
            />
        );
    }
    if (surveySubmitted) {
        return (
            <div className="flex items-center justify-center h-full">
                <h2 className="text-2xl font-bold">Thank you for your participation!</h2>
            </div>
        );
    }

    const currentTask = orderedTasks[currentTaskIndex];
    const isChatEnabled = currentTask?.isAIEnabled;
    const editorWidthClass = currentPanel ? "w-3/4" : "w-full";

    if (!hasStarted) {
        return <IntroScreen onStart={data => { setSession(data); setHasStarted(true); }} />;
    }

    return (
        <div className="App bg-gray-100 h-full flex flex-col overflow-hidden">
            <header className="bg-gray-600 text-white py-4 shadow-md flex justify-between items-center px-4">
                <h1 className="text-3xl font-bold">AIdependencyLab</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-lg">
                        Time Left: {Math.floor(timeLeft/60)}:
                        {timeLeft%60 < 10 ? '0' : ''}{timeLeft%60}
                    </div>
                    <button
                        onClick={() =>
                            window.confirm("Are you sure you want to submit the test?") &&
                            handleTestSubmitAndRedirect()
                        }
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit Test
                    </button>
                </div>
            </header>

            <main className="flex flex-1 relative overflow-hidden">
                {/* TASKS PANEL */}
                {currentPanel === "task" && currentTask && (
                    <div className="absolute left-0 top-0 h-full w-1/4 border-r border-gray-300 transition-transform duration-300">
                        <TestTasksPanel
                            task={currentTask}
                            currentTaskIndex={currentTaskIndex}
                            totalTasks={orderedTasks.length}
                            onSubmit={handleTaskSubmit}
                        />
                    </div>
                )}

                {/* CODE EDITOR */}
                <div
                    className={`transition-all duration-300 ${
                        currentPanel === "task"
                            ? "w-3/4 ml-[25%]"
                            : currentPanel === "chat"
                                ? "w-3/4 mr-[25%]"
                                : "w-full"
                    }`}
                >
                    <CodeEditor />
                </div>

                {/* CHAT PANEL */}
                {isChatEnabled && session && currentExerciseId && currentPanel === "chat" && (
                    <div className="absolute right-0 top-0 h-full w-1/4 border-l border-gray-300 transition-transform duration-300 overflow-hidden">
                        <ChatPanel
                            sessionId={session.sessionId}
                            currentExerciseId={currentExerciseId}
                        />
                    </div>
                )}

                {/* TASKS TOGGLE BUTTON */}
                <div
                    className={`absolute top-1/2 transform -translate-y-1/2 z-20 ${
                        currentPanel === "task" ? "left-[25%]" : "left-0"
                    }`}
                >
                    <button
                        onClick={() => togglePanel("task")}
                        className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-r focus:outline-none"
                    >
                        {currentPanel === "task" ? "<" : "Tasks >"}
                    </button>
                </div>

                {/* CHAT TOGGLE BUTTON */}
                {isChatEnabled && (
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 z-20 ${
                            currentPanel === "chat" ? "right-[25%]" : "right-0"
                        }`}
                    >
                        <button
                            onClick={() => togglePanel("chat")}
                            className="flex items-center bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-l focus:outline-none"
                        >
                            {currentPanel === "chat" ? ">" : "< ChatGPT"}
                        </button>
                    </div>
                )}
            </main>

            <footer className="text-center text-gray-600 py-4">
                &copy; {new Date().getFullYear()} AIdependencyLab
            </footer>
        </div>
    );
};

export default App;
