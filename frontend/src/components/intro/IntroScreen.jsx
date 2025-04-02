// src/components/intro/IntroScreen.jsx
import React, { useState } from 'react';

const IntroScreen = ({ onStart }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        yearOfStudy: '',
        codingExperience: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleStart = () => {
        // Validate that all fields are filled in
        if (!formData.firstName || !formData.lastName || !formData.yearOfStudy || !formData.codingExperience) {
            alert("Please fill in all fields.");
            return;
        }
        onStart(formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md p-8 w-3/4 grid grid-cols-2 gap-8 rounded">
                {/* Left Column: Instructions */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        Welcome to the AIdependencyLab Test
                    </h2>
                    <p className="mb-4">
                        This test is designed to assess your ability to solve programming tasks
                        with and without AI assistance. Please read the following instructions:
                    </p>
                    <ul className="list-disc list-inside mb-4">
                        <li>You will have 10 exercises to complete.</li>
                        <li>Half of them will be AI-assisted, half without AI.</li>
                        <li>Your code submissions are logged for analysis.</li>
                        <li>Please read each task carefully and follow the instructions.</li>
                        <li>You can use the built-in AI chat for guidance on AI-assisted tasks.</li>
                    </ul>
                    <p>
                        When you are ready, please fill out the form on the right and click <strong>Start</strong> to begin. Good luck!
                    </p>
                </div>
                {/* Right Column: User Info Form */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">User Information</h3>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="firstName" className="block font-medium mb-1">
                                First Name:
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block font-medium mb-1">
                                Last Name:
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="yearOfStudy" className="block font-medium mb-1">
                                Year of Study:
                            </label>
                            <select
                                id="yearOfStudy"
                                name="yearOfStudy"
                                value={formData.yearOfStudy}
                                onChange={handleChange}
                                className="border border-gray-300 rounded p-2 w-full"
                            >
                                <option value="">Select your year</option>
                                <option value="1">1st</option>
                                <option value="2">2nd</option>
                                <option value="3">3rd</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="codingExperience" className="block font-medium mb-1">
                                Coding Experience:
                            </label>
                            <select
                                id="codingExperience"
                                name="codingExperience"
                                value={formData.codingExperience}
                                onChange={handleChange}
                                className="border border-gray-300 rounded p-2 w-full"
                            >
                                <option value="">Select your experience level</option>
                                <option value="0-6">0–6 months</option>
                                <option value="6-12">6-12 months</option>
                                <option value="1-2y">1–2 years</option>
                                <option value="2plus">2+ years</option>

                            </select>
                        </div>
                    </form>
                    <button
                        onClick={handleStart}
                        className="mt-6 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                    >
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntroScreen;
