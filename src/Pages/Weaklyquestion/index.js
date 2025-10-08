import React, { useEffect, useState } from 'react';
import './Weaklyquestion.css';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Weaklyquestion = () => {
    const API_BASE = "https://site2demo.in/marriageapp/api";

    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newStatus, setNewStatus] = useState('active');
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const isAdmin = true; // Replace with actual auth logic

    // ✅ Get logged-in user ID from localStorage
    const getUserId = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return null;
        try {
            const userObj = JSON.parse(storedUser);
            return userObj?.id || null;
        } catch {
            return null;
        }
    };

    // Fetch all questions
    const fetchQuestions = async () => {
        try {
            const resp = await fetch(`${API_BASE}/weakly-questions-list`);
            const data = await resp.json();
            if (data.status && Array.isArray(data.data)) {
                setQuestions(
                    data.data.map(q => ({
                        id: q.id,
                        text: q.question,
                        status: q.status.charAt(0).toUpperCase() + q.status.slice(1),
                    }))
                );
            } else {
                toast.error(data.message || "Failed to load questions");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            toast.error("Something went wrong while loading questions");
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Save or update question
    const handleSaveQuestion = async (e) => {
        e.preventDefault();

        if (!newQuestion.trim()) {
            toast.warn("Question cannot be empty");
            return;
        }

        const userId = getUserId();
        if (!userId) {
            toast.error("Invalid user. Please login again.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('question', newQuestion.trim());
            formData.append('status', newStatus.toLowerCase());
            formData.append('user_id', userId); // Must send user_id

            let url = `${API_BASE}/question-create`;
            if (editId) {
                url = `${API_BASE}/weakly-question-update`;
                formData.append('id', editId); // Must send id for update
            }

            const resp = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            const respData = await resp.json();

            if (respData.status) {
                toast.success(respData.message || (editId ? "Updated successfully" : "Created successfully"));
                fetchQuestions();
                setNewQuestion('');
                setNewStatus('active');
                setEditId(null);
                setShowForm(false);
            } else {
                toast.error(respData.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving/updating:", error);
            toast.error("Something went wrong while saving");
        } finally {
            setLoading(false);
        }
    };

    // Delete question
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Confirm deletion',
            text: "Do you want to delete this question?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!confirm.isConfirmed) return;

        const userId = getUserId();
        if (!userId) {
            toast.error("Invalid user. Cannot delete.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('user_id', userId); // Must send user_id

            const resp = await fetch(`${API_BASE}/weakly-question-delete`, {
                method: 'POST',
                body: formData,
            });

            const respData = await resp.json();
            if (respData.status) {
                toast.success(respData.message || "Deleted successfully");
                setQuestions(prev => prev.filter(q => q.id !== id));
            } else {
                toast.error(respData.message || "Delete failed");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Something went wrong while deleting");
        } finally {
            setLoading(false);
        }
    };

    // Edit question
    const handleEdit = (q) => {
        setNewQuestion(q.text);
        setNewStatus(q.status.toLowerCase());
        setEditId(q.id);
        setShowForm(true);
    };

    return (
        <div className="weaklyquestion-container">
            <div className="weakly-header-section">
                <h1>Question List</h1>
                {isAdmin && (
                    <button className="weakly-question-add-button" onClick={() => {
                        setShowForm(true);
                        setEditId(null);
                        setNewQuestion('');
                        setNewStatus('active');
                    }}>
                        ➕ Add Question
                    </button>
                )}
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>{editId ? "Edit Question" : "Add New Question"}</h3>
                        <form onSubmit={handleSaveQuestion}>
                            <input
                                type="text"
                                placeholder="Enter question..."
                                value={newQuestion}
                                onChange={e => setNewQuestion(e.target.value)}
                                required
                            />
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
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

            <div className="weakly-table-wrapper">
                <table className="weakly-question-table">
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
                            questions.map(q => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td>{q.text}</td>
                                    <td>{q.status}</td>
                                    {isAdmin && (
                                        <td className="actions">
                                            <button className="edit-btn" onClick={() => handleEdit(q)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(q.id)}>Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? "4" : "3"}>No questions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Weaklyquestion;
