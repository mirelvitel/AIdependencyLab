// src/components/survey/SurveyForm.jsx
import React, { useState } from 'react';

const SurveyForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        overallImpact: '',
        conceptualUnderstanding: '',
        skillBalance: '',
        confidenceChange: '',
        independentPreparedness: '',
        additionalFeedback: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Optionally, submit the data to your backend here.
        onSubmit(formData);
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">Survey</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">
                        Overall Impact: "Overall, how would you rate the impact of AI assistance on your programming learning experience?"
                    </label>
                    <input
                        type="number"
                        name="overallImpact"
                        value={formData.overallImpact}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="font-semibold block mb-1">
                        Conceptual Understanding: "How has AI assistance affected your understanding of fundamental programming concepts?"
                    </label>
                    <input
                        type="number"
                        name="conceptualUnderstanding"
                        value={formData.conceptualUnderstanding}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="font-semibold block mb-1">
                        Skill Balance: "How do you perceive the balance between using AI assistance and developing your own coding skills?"
                    </label>
                    <input
                        type="number"
                        name="skillBalance"
                        value={formData.skillBalance}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="font-semibold block mb-1">
                        Confidence Change: "Compared to before you started using AI assistance regularly, how has your confidence in your programming abilities changed?"
                    </label>
                    <input
                        type="number"
                        name="confidenceChange"
                        value={formData.confidenceChange}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="font-semibold block mb-1">
                        Independent Preparedness: "If you were required to work without AI assistance, how prepared would you feel to tackle programming challenges?"
                    </label>
                    <input
                        type="number"
                        name="independentPreparedness"
                        value={formData.independentPreparedness}
                        onChange={handleChange}
                        min="1"
                        max="5"
                        className="w-full border border-gray-300 rounded p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="font-semibold block mb-1">Additional Feedback (optional):</label>
                    <textarea
                        name="additionalFeedback"
                        value={formData.additionalFeedback}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                        rows="4"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Submit Survey
                </button>
            </form>
        </div>
    );
};

export default SurveyForm;
