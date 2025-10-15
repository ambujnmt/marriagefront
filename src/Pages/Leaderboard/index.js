import React, { useEffect, useState } from "react";
import "./Leaderboard.css"; // External CSS file

const Leaderboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://site2demo.in/marriageapp/api/reletionship-all-list")
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="leaderboard-container">
            <h1>Your Relationship Stats</h1>

            <div className="stats-card">
                <div className="stat">
                    <h3>User Score</h3>
                    <p>{data.user_score}</p>
                </div>
                <div className="stat">
                    <h3>Level</h3>
                    <p>{data.level}</p>
                </div>
                <div className="stat">
                    <h3>Streak Days</h3>
                    <p>{data.streak_days}</p>
                </div>
                <div className="stat">
                    <h3>Regional Avg</h3>
                    <p>{data.regional_avg}</p>
                </div>
                <div className="stat">
                    <h3>Top 10 Avg</h3>
                    <p>{data.top_10_avg}</p>
                </div>
            </div>

            <h2>Leaderboard</h2>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {data.leaderboard.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
