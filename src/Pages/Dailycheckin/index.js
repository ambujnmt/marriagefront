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

    const USER_ID = 1; // replace with dynamic login user if available

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
                        status: q.status.charAt(0).toUpperCase() + q.status.slice(1),
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
                await fetchQuestions(); // reload table
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
            confirmButtonText: 'Yes, delete it!'
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
                await fetchQuestions(); // reload table
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

    return (
        <div className="daily-checkin-container">
            <div className="header-check">
                {isAdmin && (
                    <button className="add-question-button" onClick={handleAddNew}>
                        ➕ Add Question
                    </button>
                )}
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
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
                            <div className="modal-buttons">
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
                        {questions.length > 0 ? (
                            questions.map((q) => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td>{q.text}</td>
                                    <td>{q.status}</td>
                                    {isAdmin && (
                                        <td>
                                            <button className='daily-question-form button' onClick={() => handleEdit(q)}>✏️ Edit</button>
                                            <button className='daily-question-form-delete'
                                                onClick={() => handleDelete(q.id)}
                                                style={{ marginLeft: '8px', color: 'red' }}
                                            >
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

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default DailyCheckin;
