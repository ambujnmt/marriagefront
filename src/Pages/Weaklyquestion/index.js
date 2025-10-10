import React, { useEffect, useState } from 'react';
import './Weaklyquestion.css';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "https://site2demo.in/marriageapp/api";

const Weaklyquestion = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newStatus, setNewStatus] = useState('active');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const isAdmin = true;

    // const USER_ID = 1;
    const USER_ID = localStorage.getItem('user_id');

    const fetchQuestions = async () => {
        try {
            const resp = await fetch(`${API_BASE}/weakly-questions-list`);
            const data = await resp.json();
            if (data.status && Array.isArray(data.data)) {
                setQuestions(
                    data.data.map(q => ({
                        id: q.id,
                        text: q.question,
                        status: q.status.charAt(0).toUpperCase() + q.status.slice(1)
                    }))
                );
            } else {
                toast.error(data.message || "Failed to load questions");
                setQuestions([]);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            toast.error("Something went wrong while loading questions");
            setQuestions([]);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Create or update question
    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) {
            toast.warn("Question cannot be empty");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('question', newQuestion.trim());
            formData.append('status', newStatus.toLowerCase());
            formData.append('user_id', USER_ID);

            let url = `${API_BASE}/weakly-question`;
            if (editingQuestion) {
                url = `${API_BASE}/weakly-question-update`;
                formData.append('id', editingQuestion.id);
            }

            const resp = await fetch(url, { method: 'POST', body: formData });
            const data = await resp.json();

            if (data.status) {
                toast.success(data.message || (editingQuestion ? "Updated successfully" : "Created successfully"));
                await fetchQuestions();
                resetForm();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            console.error("Error saving/updating question:", error);
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

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('user_id', USER_ID);

            const resp = await fetch(`${API_BASE}/weakly-question-delete`, { method: 'POST', body: formData });
            const data = await resp.json();

            if (data.status) {
                toast.success(data.message || "Deleted successfully");
                await fetchQuestions();
            } else {
                toast.error(data.message || "Delete failed");
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            toast.error("Something went wrong while deleting");
        } finally {
            setLoading(false);
        }
    };

    // Open edit modal
    const handleEdit = (q) => {
        setNewQuestion(q.text);
        setNewStatus(q.status.toLowerCase());
        setEditingQuestion(q);
        setShowForm(true);
    };

    // Open create modal
    const handleAddNew = () => {
        setNewQuestion('');
        setNewStatus('active');
        setEditingQuestion(null);
        setShowForm(true);
    };

    const resetForm = () => {
        setNewQuestion('');
        setNewStatus('active');
        setEditingQuestion(null);
        setShowForm(false);
    };

    return (
        <div className="weaklyquestion-container">
            <div className="weakly-header-section">
                <h1>Question List</h1>
                {isAdmin && <button className="weakly-question-add-button" onClick={handleAddNew}>➕ Add Question</button>}
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>{editingQuestion ? "Edit Question" : "Add New Question"}</h3>
                        <form onSubmit={handleSaveQuestion}>
                            <input type="text" placeholder="Enter question..." value={newQuestion} onChange={e => setNewQuestion(e.target.value)} required />
                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <div className="modal-buttons">
                                <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                                <button type="button" onClick={resetForm}>Cancel</button>
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
                                <td colSpan={isAdmin ? "4" : "3"} style={{ textAlign: "center" }}>No questions found</td>
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
