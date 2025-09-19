import React, { useState } from 'react';
import './DailyCheckin.css';

const DailyCheckin = () => {
    const [action1, setAction1] = useState('');
    const [action2, setAction2] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert('Submitted!');
    };

    return (
        <div className="daily-checkin-container">
            <div className="header-check">
                <button className="back-button" onClick={() => window.history.back()}>
                    &#8592;
                </button>
                <h1>Daily Check-In</h1>
            </div>
            <form className="checkin-form" onSubmit={handleSubmit}>
                <label className="label">Log a positive action you did for the relationship</label>
                <input
                    type="text"
                    placeholder="E.g. Cooked a nice dinner"
                    value={action1}
                    onChange={(e) => setAction1(e.target.value)}
                    className="input"
                />

                <label className="label">What did you notice from your partner?</label>
                <input
                    type="text"
                    placeholder="E.g. Gave-me a hug"
                    value={action2}
                    onChange={(e) => setAction2(e.target.value)}
                    className="input"
                />

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default DailyCheckin;