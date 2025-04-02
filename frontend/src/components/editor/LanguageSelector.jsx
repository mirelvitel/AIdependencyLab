import React from 'react';

const LanguageSelector = ({ language, onLanguageChange }) => {
    return (
        <div className="flex items-center mb-4">
            <label htmlFor="language" className="mr-2 font-medium">
                Language:
            </label>
            <select
                id="language"
                value={language}
                onChange={onLanguageChange}
                className="border border-gray-300 rounded p-1"
            >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
