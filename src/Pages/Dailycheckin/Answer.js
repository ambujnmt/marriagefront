import React, { useState, useEffect } from 'react';
import './Answer.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { createPortal } from 'react-dom';

const API_BASE = "https://site2demo.in/marriageapp/api";

const Answer = () => {
    const [answers, setAnswers] = useState([]);
    const [filteredAnswers, setFilteredAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editAnswer, setEditAnswer] = useState(null);
    const [newAnswerText, setNewAnswerText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('view');

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
            console.error(error);
            toast.error("Error fetching answers.");
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
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id })
                    });
                    const data = await response.json();
                    if (data.status) {
                        toast.success(data.message || "Deleted successfully");
                        setAnswers(prev => prev.filter(a => a.id !== id));
                    } else {
                        toast.error(data.message || "Delete failed");
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Error deleting answer");
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
                toast.success(data.message || "Answer updated");
                setAnswers(prev => prev.map(a => a.id === editAnswer.id ? { ...a, answer: newAnswerText } : a));
                closeModal();
            } else toast.error(data.message || "Update failed");
        } catch (error) {
            console.error(error);
            toast.error("Error updating answer");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditAnswer(null);
        setNewAnswerText('');
    };

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
                    <select
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
                <div className="daily-search-container">
                    <input
                        type="text"
                        placeholder="Search answers..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="daily-search-input"
                    />
                </div>
            </div>

            {/* Table */}
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
                    {currentAnswers.length ? currentAnswers.map(a => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.question?.question}</td>
                            <td>{a.user?.first_name}</td>
                            <td>
                                <div className="answer-text">{a.answer}</div>
                                <button className="view-more-btn" onClick={() => handleViewAnswer(a)}>View</button>
                            </td>
                            <td>
                                <button className="ans-edit-btn" onClick={() => handleEdit(a)}>Edit</button>
                                <button className="ans-delete-btn" onClick={() => handleDelete(a.id)}>Delete</button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>No answers found</td></tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="ans-pagination-container">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="ans-pagination-btn">Previous</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`ans-pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        >{i + 1}</button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="ans-pagination-btn">Next</button>
                </div>
            )}

            {/* Modal using portal */}
            {showModal && createPortal(
                <div className="answer-container-modal-overlay" onClick={closeModal}>
                    <div className="answer-container-modal" onClick={e => e.stopPropagation()}>
                        {modalType === 'view' ? (
                            <div>
                                <h2 className="modal-title">Answer Details</h2>
                                <div className="modal-content">
                                    <p><strong>Question:</strong> {editAnswer?.question?.question}</p>
                                    <p><strong>User:</strong> {editAnswer?.user?.first_name}</p>
                                    <p className="modal-answer-text">{editAnswer?.answer}</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="ans-close-btn" onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="modal-title">Edit Answer</h2>
                                <form onSubmit={handleUpdateAnswer}>
                                    <textarea value={newAnswerText} onChange={e => setNewAnswerText(e.target.value)} rows={5} required />
                                    <div className="modal-footer">
                                        <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Answer'}</button>
                                        <button type="button" className="ans-close-btn" onClick={closeModal}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Answer;
