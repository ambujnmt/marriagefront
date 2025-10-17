import React, { useState, useEffect } from 'react';
import './Rating.css';

const RatingList = () => {
    const apiUrl = 'https://site2demo.in/marriageapp/api/daily-all-rating-list';
    const deleteUrl = 'https://site2demo.in/marriageapp/api/delete-rating';

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
            const result = await response.json();
            if (result.status) {
                setData(result.data);
                setFilteredData(result.data);
            } else {
                console.error("API Error:", result.message);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this rating?")) return;

        try {
            const response = await fetch(`${deleteUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            if (result.status) {
                alert("Rating deleted successfully!");
                fetchData();
            } else {
                alert("Failed to delete rating.");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("An error occurred while deleting.");
        }
    };

    const handleEdit = (id) => {
        alert(`Edit function called for rating ID: ${id}`);
    };

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearch(keyword);
        setPage(1);
        if (keyword === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                item.user_name.toLowerCase().includes(keyword) ||
                item.feedback.toLowerCase().includes(keyword)
            );
            setFilteredData(filtered);
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / perPage);
    const startIndex = (page - 1) * perPage;
    const currentPageData = filteredData.slice(startIndex, startIndex + perPage);

    return (
        <div className="rating-container">
            <h1>Rating List</h1>

            <input
                type="text"
                placeholder="Search by user name or feedback"
                value={search}
                onChange={handleSearch}
                className="rating-search-input"
            />

            {loading ? (
                <p>Loading...</p>
            ) : currentPageData.length === 0 ? (
                <p>No ratings found.</p>
            ) : (
                <div className="rating-table-container">
                    <table className="rating-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Rating</th>
                                <th>Feedback</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.user_name}</td>
                                    <td>{item.rating}</td>
                                    <td>{item.feedback}</td>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>
                                        <button onClick={() => handleEdit(item.id)} className="rating-edit-btn">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="rating-delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="rating-pagination">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingList;
