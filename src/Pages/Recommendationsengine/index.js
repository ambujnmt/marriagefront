import React, { useState, useEffect } from 'react';
import './RecommendationsEngine.css';  // External CSS for custom styles

const RecommendationsEngine = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        fetch('https://site2demo.in/marriageapp/api/recomendation-all')
            .then(response => response.json())
            .then(data => {
                // Access the 'recommendations' key from the response
                if (data.recommendations && Array.isArray(data.recommendations)) {
                    setData(data.recommendations);
                } else {
                    setError('Invalid data format');
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };

        return date.toLocaleDateString('en-GB', options);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="recommendations-container">
            <h2>Recommendations</h2>
            <table className="recomedation-table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        {/* <th>Button</th> */}
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Ensure data is an array and map over it */}
                    {Array.isArray(data) && data.length > 0 ? (
                        data.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                                {/* <td>
                                    <a href={item.button_link} target="_blank" rel="noopener noreferrer">
                                        {item.button_label}
                                    </a>
                                </td> */}
                                <td>{formatDate(item.created_at)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RecommendationsEngine;
