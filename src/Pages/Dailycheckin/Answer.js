import React, { useState, useEffect } from 'react';
import './Answer.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const API_BASE = "https://site2demo.in/marriageapp/api";

const Answer = () => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editAnswer, setEditAnswer] = useState(null);
    const [newAnswerText, setNewAnswerText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('view');

    useEffect(() => {
        fetchAnswers();
    }, []);

    const fetchAnswers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/answer-list`);
            const data = await response.json();
            if (data.status && Array.isArray(data.data)) {
                setAnswers(data.data);
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
                        setAnswers(answers.filter(answer => answer.id !== id));
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
                headers: {
                    "Content-Type": "application/json",
                },
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
                setAnswers(answers.map((answer) =>
                    answer.id === editAnswer.id ? { ...answer, answer: newAnswerText } : answer
                ));
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

    return (
        <div className="answer-container">
            <h1>Answer List</h1>

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
                    {answers.length > 0 ? (
                        answers.map((answer) => (
                            <tr key={answer.id}>
                                <td>{answer.id}</td>
                                <td>{answer.question.question}</td>
                                <td>{answer.user.first_name}</td>
                                <td>
                                    <div className="answer-text">
                                        {answer.answer}

                                    </div>
                                    <button className="btn btn-primary" onClick={() => handleViewAnswer(answer)}>View</button>
                                </td>
                                <td>

                                    <button className="edit-btn" onClick={() => handleEdit(answer)}>Edit</button>


                                    <button className="delete-btn" onClick={() => handleDelete(answer.id)}>Delete</button>
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

            {/* Modal for editing or viewing an answer */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        {modalType === 'view' ? (
                            <div>
                                <h2>View Answer</h2>
                                <p>{editAnswer.answer}</p>
                                <button className="close-btn" onClick={closeModal}>Close</button>
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
