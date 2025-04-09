import React, { useState } from 'react';
import axios from 'axios';

const SurveyForm = ({ sessionId, onSubmit }) => {
    const [responses, setResponses] = useState({
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResponses((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!responses.q1 || !responses.q2 || !responses.q3 || !responses.q4 || !responses.q5) {
            alert("Please complete all survey questions.");
            return;
        }

        try {
            await axios.post('/api/save-survey', { ...responses, sessionId });
            onSubmit(responses);
        } catch (error) {
            console.error("Error saving survey:", error);
            alert("Error saving survey responses.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md p-8 w-3/4 grid grid-cols-1 gap-4 rounded"
            >
                <h2 className="text-2xl font-bold mb-4">Survey</h2>

                <div>
                    <label className="block font-medium mb-1">
                        Overall, how would you rate the impact of AI assistance on your programming learning experience?
                    </label>
                    <select
                        name="q1"
                        value={responses.q1}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="">Select an option</option>
                        <option value="Very Negative">1 = Very Negative</option>
                        <option value="Negative">2 = Negative</option>
                        <option value="Neutral">3 = Neutral</option>
                        <option value="Positive">4 = Positive</option>
                        <option value="Very Positive">5 = Very Positive</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        How has AI assistance affected your understanding of fundamental programming concepts?
                    </label>
                    <select
                        name="q2"
                        value={responses.q2}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="">Select an option</option>
                        <option value="No Improvement">1 = No Improvement</option>
                        <option value="Slight Improvement">2 = Slight Improvement</option>
                        <option value="Some Improvement">3 = Some Improvement</option>
                        <option value="Moderate Improvement">4 = Moderate Improvement</option>
                        <option value="Significant Improvement">5 = Significant Improvement</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        How do you perceive the balance between using AI assistance and developing your own coding skills?
                    </label>
                    <select
                        name="q3"
                        value={responses.q3}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="">Select an option</option>
                        <option value="Rely Almost Entirely on AI">1 = Rely Almost Entirely on AI</option>
                        <option value="Mostly Rely on AI">2 = Mostly Rely on AI</option>
                        <option value="Balanced Use">3 = Balanced Use</option>
                        <option value="Mostly Rely on My Own Skills">4 = Mostly Rely on My Own Skills</option>
                        <option value="Use AI Very Little">5 = Use AI Very Little</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Compared to before you started using AI assistance regularly, how has your confidence in your programming abilities changed?
                    </label>
                    <select
                        name="q4"
                        value={responses.q4}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="">Select an option</option>
                        <option value="Much Lower Confidence">1 = Much Lower Confidence</option>
                        <option value="Somewhat Lower">2 = Somewhat Lower</option>
                        <option value="No Change">3 = No Change</option>
                        <option value="Somewhat Higher">4 = Somewhat Higher</option>
                        <option value="Much Higher">5 = Much Higher</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        If you were required to work without AI assistance, how prepared would you feel to tackle programming challenges?
                    </label>
                    <select
                        name="q5"
                        value={responses.q5}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="">Select an option</option>
                        <option value="Not Prepared at All">1 = Not Prepared at All</option>
                        <option value="Slightly Prepared">2 = Slightly Prepared</option>
                        <option value="Moderately Prepared">3 = Moderately Prepared</option>
                        <option value="Well Prepared">4 = Well Prepared</option>
                        <option value="Fully Prepared">5 = Fully Prepared</option>
                    </select>
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
