import React, { useState, useEffect } from 'react';
import './DailyCheckin.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const API_BASE = "https://site2demo.in/marriageapp/api";

const DailyCheckin = () => {
    const [questions, setQuestions] = useState([]);
    const [isAdmin] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [newQuestion, setNewQuestion] = useState('');
    const [newStatus, setNewStatus] = useState('active');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const USER_ID = localStorage.getItem('user_id');

    useEffect(() => {
        fetchQuestions();
    }, [searchQuery, itemsPerPage]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`${API_BASE}/questions`);
            const data = await response.json();
            if (data.status && Array.isArray(data.data)) {
                const formattedQuestions = data.data.map(q => ({
                    id: q.id,
                    text: q.question,
                    status: q.status.charAt(0).toUpperCase() + q.status.slice(1),
                }));
                setQuestions(formattedQuestions);
            } else {
                toast.error("Failed to load questions");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            toast.error("Something went wrong while loading questions");
        }
    };

    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) {
            toast.error("Question cannot be empty");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('question', newQuestion.trim());
            formData.append('status', newStatus.toLowerCase());
            formData.append('user_id', USER_ID);

            let url = `${API_BASE}/question-create`;
            if (editingQuestion) {
                url = `${API_BASE}/question-update`;
                formData.append('id', editingQuestion.id);
            }

            const response = await fetch(url, { method: "POST", body: formData });
            const data = await response.json();

            if (data.status) {
                toast.success(data.message || (editingQuestion ? "Question updated successfully" : "Question created successfully"));
                await fetchQuestions();
                resetForm();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving question:", error);
            toast.error("Something went wrong while saving question");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (questionId) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this question?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!confirm.isConfirmed) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('id', questionId);
            formData.append('user_id', USER_ID);

            const response = await fetch(`${API_BASE}/question-delete`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.status) {
                toast.success(data.message || "Question deleted successfully");
                await fetchQuestions();
            } else {
                toast.error(data.message || "Failed to delete question");
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            toast.error("Something went wrong while deleting question");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingQuestion(null);
        setNewQuestion('');
        setNewStatus('active');
        setShowForm(false);
    };

    const handleEdit = (q) => {
        setEditingQuestion(q);
        setNewQuestion(q.text);
        setNewStatus(q.status.toLowerCase());
        setShowForm(true);
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredQuestions = questions.filter(q =>
        q.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedQuestions = filteredQuestions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    return (
        <div className="daily-checkin-container">
            <div className="header-check">
                {isAdmin && (
                    <button className="add-question-button" onClick={handleAddNew}>
                        ➕ Add Question
                    </button>
                )}
            </div>

            <div className="controls-bar">
                <div className="dailycheck-filter-container">
                    <label htmlFor="items-per-page">Show per page:</label>
                    <select
                        id="items-per-page"
                        onChange={handleItemsPerPageChange}
                        value={itemsPerPage}
                        className="items-per-page-dropdown"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>

                <div className="quest-daily-search-container">
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="daily-search-input"
                    />
                </div>
            </div>

            {showForm && (
                <div className="ques-daily-modal-overlay">
                    <div className="ques-daily-modal">
                        <h3>{editingQuestion ? "Edit Question" : "Add New Question"}</h3>
                        <form onSubmit={handleSaveQuestion}>
                            <input
                                type="text"
                                placeholder="Enter question..."
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                required
                            />
                            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <div className="ques-daily-modal-buttons">
                                <button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button type="button" onClick={resetForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="question-table-section">
                <table className="question-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Question</th>
                            <th>Status</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedQuestions.length > 0 ? (
                            paginatedQuestions.map((q) => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td>{q.text}</td>
                                    <td>{q.status}</td>
                                    {isAdmin && (
                                        <td>
                                            <button className='daily-question-form' onClick={() => handleEdit(q)}>✏️ Edit</button>
                                            <button className='daily-question-form-delete' onClick={() => handleDelete(q.id)}>
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? "4" : "3"} style={{ textAlign: "center" }}>
                                    No questions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* {totalPages > 1 && (
                <div className="daily-pagination">
                    <button
                        className={`daily-pagination-btn daily-pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <button
                                key={pageNumber}
                                className={`daily-pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                                onClick={() => setCurrentPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        className={`daily-pagination-btn daily-pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>

            )} */}
            {totalPages > 1 && (
                <div className="daily-pagination">
                    <button
                        className={`daily-pagination-btn daily-pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <button
                                key={pageNumber}
                                className={`daily-pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                                onClick={() => setCurrentPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        className={`daily-pagination-btn daily-pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            )}


            <ToastContainer />
        </div>
    );
};

export default DailyCheckin;
