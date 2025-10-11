import React, { useState, useEffect } from 'react';
import './Answer.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const API_BASE = "https://site2demo.in/marriageapp/api";

const Answer = () => {
    const [answers, setAnswers] = useState([]);
    const [filteredAnswers, setFilteredAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editAnswer, setEditAnswer] = useState(null);
    const [newAnswerText, setNewAnswerText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('view');

    // Pagination & Search
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchAnswers();
    }, []);

    useEffect(() => {
        handleSearch(searchQuery);
    }, [answers, searchQuery]);

    const fetchAnswers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/answer-list`);
            const data = await response.json();
            if (data.status && Array.isArray(data.data)) {
                setAnswers(data.data);
                setFilteredAnswers(data.data);
            } else {
                toast.error("Failed to load answers.");
            }
        } catch (error) {
            console.error("Error fetching answers:", error);
            toast.error("Something went wrong while fetching answers.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = answers.filter((answer) =>
            answer.answer.toLowerCase().includes(query.toLowerCase()) ||
            answer.question.question.toLowerCase().includes(query.toLowerCase()) ||
            answer.user.first_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredAnswers(filtered);
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    const response = await fetch(`${API_BASE}/answer-delete`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id })
                    });

                    const data = await response.json();
                    if (data.status) {
                        toast.success(data.message || "Answer deleted successfully");
                        const updatedAnswers = answers.filter(answer => answer.id !== id);
                        setAnswers(updatedAnswers);
                    } else {
                        toast.error(data.message || "Failed to delete answer");
                    }
                } catch (error) {
                    console.error("Error deleting answer:", error);
                    toast.error("Something went wrong while deleting the answer.");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const handleEdit = (answer) => {
        setEditAnswer(answer);
        setNewAnswerText(answer.answer);
        setModalType('edit');
        setShowModal(true);
    };

    const handleViewAnswer = (answer) => {
        setEditAnswer(answer);
        setModalType('view');
        setShowModal(true);
    };

    const handleUpdateAnswer = async (e) => {
        e.preventDefault();
        if (!newAnswerText.trim()) return;
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/answer-update`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editAnswer.id,
                    answer: newAnswerText,
                    question_id: editAnswer.question_id,
                    user_id: editAnswer.user_id
                }),
            });

            const data = await response.json();

            if (data.status) {
                toast.success(data.message || "Answer updated successfully");
                const updated = answers.map((ans) =>
                    ans.id === editAnswer.id ? { ...ans, answer: newAnswerText } : ans
                );
                setAnswers(updated);
                setShowModal(false);
                setEditAnswer(null);
                setNewAnswerText('');
            } else {
                toast.error(data.message || "Failed to update answer");
            }
        } catch (error) {
            console.error("Error updating answer:", error);
            toast.error("Something went wrong while updating the answer.");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditAnswer(null);
        setNewAnswerText('');
    };

    // Pagination logic
    const indexOfLastAnswer = currentPage * itemsPerPage;
    const indexOfFirstAnswer = indexOfLastAnswer - itemsPerPage;
    const currentAnswers = filteredAnswers.slice(indexOfFirstAnswer, indexOfLastAnswer);
    const totalPages = Math.ceil(filteredAnswers.length / itemsPerPage);

    return (
        <div className="answer-container">
            <h1>Answer List</h1>

            {/* Controls */}
            <div className="controls-bar">
                <div className="filter-container">
                    <label>Show:</label>
                    <select value={itemsPerPage} onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div className="daily-search-container">
                    <input
                        className="daily-search-input"
                        type="text"
                        placeholder="Search answers..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Answers Table */}
            <table className="answers-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Question</th>
                        <th>User Name</th>
                        <th>Answer</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAnswers.length > 0 ? (
                        currentAnswers.map((answer) => (
                            <tr key={answer.id}>
                                <td>{answer.id}</td>
                                <td>{answer.question.question}</td>
                                <td>{answer.user.first_name}</td>
                                <td>
                                    <div className="answer-text">{answer.answer}</div>
                                    <button className="ans-btn" onClick={() => handleViewAnswer(answer)}>View</button>
                                </td>
                                <td>
                                    <button className="ans-edit-btn" onClick={() => handleEdit(answer)}>Edit</button>
                                    <button className="ans-delete-btn" onClick={() => handleDelete(answer.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>No answers found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}

            {totalPages > 1 && (
                <div className="ans-pagination-container">
                    <button
                        className="ans-pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`ans-pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="ans-pagination-btn"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}


            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        {modalType === 'view' ? (
                            <div>
                                <h2>View Answer</h2>
                                <p>{editAnswer.answer}</p>
                                <button className="ans-close-btn" onClick={closeModal}>Close</button>
                            </div>
                        ) : (
                            <div>
                                <h2>Edit Answer</h2>
                                <form onSubmit={handleUpdateAnswer}>
                                    <textarea
                                        value={newAnswerText}
                                        onChange={(e) => setNewAnswerText(e.target.value)}
                                        rows="4"
                                        required
                                    />
                                    <div className="modal-buttons">
                                        <button type="submit" disabled={loading}>
                                            {loading ? "Updating..." : "Update Answer"}
                                        </button>
                                        <button type="button" onClick={closeModal}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Answer;
