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
    const [newQuestion, setNewQuestion] = useState('');
    const [newStatus, setNewStatus] = useState('active');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`${API_BASE}/questions`);
            const data = await response.json();
            if (data.status && Array.isArray(data.data)) {
                setQuestions(
                    data.data.map(q => ({
                        id: q.id,
                        text: q.question,
                        status: q.status.charAt(0).toUpperCase() + q.status.slice(1)
                    }))
                );
            } else {
                toast.error("Failed to load questions");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            toast.error("Something went wrong while loading questions");
        }
    };

    // Save or Update Question
    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;

        setLoading(true);
        try {
            const url = `${API_BASE}/question-update`;
            const method = "POST";

            const requestBody = {
                question: newQuestion.trim(),
                status: newStatus.toLowerCase(),
                id: editId,
                user_id: localStorage.getItem('user_id'),
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (data.status) {
                toast.success(data.message || (editId ? "Question updated" : "Question created"));
                fetchQuestions();
                setNewQuestion('');
                setNewStatus('active');
                setShowForm(false);
                setEditId(null);
            } else {
                toast.error(data.message || "Failed to save question");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong while saving question");
        } finally {
            setLoading(false);
        }
    };

    // Delete Question with SweetAlert2 confirmation
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure delete this question?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const userId = localStorage.getItem('user_id');
                    const response = await fetch(`${API_BASE}/question-delete`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify({ id, user_id: userId })
                    });

                    const data = await response.json();

                    if (data.status) {
                        toast.success(data.message || "Question deleted successfully");
                        setQuestions(questions.filter(q => q.id !== id));
                    } else {
                        toast.error(data.message || "Failed to delete question");
                    }
                } catch (error) {
                    console.error("Error deleting question:", error);
                    toast.error("Something went wrong while deleting question");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Edit Question
    const handleEdit = (q) => {
        setNewQuestion(q.text);
        setNewStatus(q.status.toLowerCase());
        setEditId(q.id);
        setShowForm(true);
    };

    return (
        <div className="daily-checkin-container">
            <div className="header-check">
                <h1>Question List</h1>
                {isAdmin && (
                    <button className="add-question-button" onClick={() => {
                        setShowForm(true);
                        setEditId(null);
                        setNewQuestion('');
                        setNewStatus('active');
                    }}>
                        ➕ Add Question
                    </button>
                )}
            </div>

            {/* Modal for Add / Edit */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editId ? "Edit Question" : "Add New Question"}</h3>
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
                            <div className="modal-buttons">
                                <button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Questions Table */}
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
                        {questions.length > 0 ? (
                            questions.map((q) => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td>{q.text}</td>
                                    <td>{q.status}</td>
                                    {isAdmin && (
                                        <td className="actions-cell">
                                            <button className="edit-btn" onClick={() => handleEdit(q)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(q.id)}>Delete</button>
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

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default DailyCheckin;
