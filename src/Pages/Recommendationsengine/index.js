import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./RecommendationsEngine.css";

const API_BASE = "https://site2demo.in/marriageapp/api";
// const loggedInUserId = 5;
const loggedInUserId = localStorage.getItem('user_id');

const RecommendationsEngine = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [form, setForm] = useState({
        id: null,
        title: "",
        subtitle: "",
        description: "",
        image: null,
        button_label: "",
        button_link: "",
    });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${API_BASE}/recomendation-all?user_id=${loggedInUserId}`
            );
            const result = await res.json();

            if (result.recommendations && Array.isArray(result.recommendations)) {
                setData(result.recommendations);
            } else {
                setData([]);
                setError("No recommendations found for this user.");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message || "Failed to fetch recommendations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    const filteredData = data.filter(
        (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.subtitle &&
                item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm((prev) => ({ ...prev, image: files[0] }));
        else setForm((prev) => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setForm({
            id: null,
            title: "",
            subtitle: "",
            description: "",
            image: null,
            button_label: "",
            button_link: "",
        });
        setModalMode("create");
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setForm({
            id: item.id,
            title: item.title || "",
            subtitle: item.subtitle || "",
            description: item.description || "",
            image: null,
            button_label: item.button_label || "",
            button_link: item.button_link || "",
        });
        setModalMode("edit");
        setShowModal(true);
    };

    const handleCreate = async () => {
        setActionLoading(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (form[key]) formData.append(key, form[key]);
            });
            formData.append("user_id", loggedInUserId);

            const res = await fetch(`${API_BASE}/recomendation-create`, {
                method: "POST",
                body: formData,
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Server did not return valid JSON.");
            }

            if (!res.ok || !data.status)
                throw new Error(data.message || "Failed to create recommendation");

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Recommendation created successfully!",
                confirmButtonText: "Okay",

                timer: 2000,
                showConfirmButton: false,
            });
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Create Error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async () => {
        setActionLoading(true);
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (form[key]) formData.append(key, form[key]);
            });
            formData.append("user_id", loggedInUserId);

            const res = await fetch(`${API_BASE}/recomendation-update`, {
                method: "POST",
                body: formData,
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Server did not return valid JSON.");
            }

            if (!res.ok || !data.status)
                throw new Error(data.message || "Failed to update recommendation");

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Recommendation updated successfully!",
                confirmButtonText: "Okay",
                timer: 2000,
                showConfirmButton: false,
            });
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Update Error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this recommendation?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    formData.append("user_id", loggedInUserId);
                    formData.append("id", id);

                    const res = await fetch(`${API_BASE}/recomendation-delete`, {
                        method: "POST",
                        body: formData,
                    });

                    const text = await res.text();
                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch {
                        throw new Error("Server did not return valid JSON.");
                    }

                    if (!res.ok || !data.status)
                        throw new Error(data.message || "Failed to delete recommendation");

                    // Swal.fire({
                    //     icon: "success",
                    //     title: "Deleted!",
                    //     text: "Recommendation deleted successfully!",
                    //     confirmButtonText: "Okay",

                    //     timer: 2000,
                    //     showConfirmButton: false,
                    // });
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "Recommendation deleted successfully!",
                        confirmButtonText: "Okay",
                        timer: undefined,
                    });

                    fetchData();
                } catch (err) {
                    console.error("Delete Error:", err);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: err.message,
                    });
                }
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        modalMode === "create" ? handleCreate() : handleUpdate();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <>
            <div className="recommendations-container">
                <h2>Recommendations</h2>

                <div className="search-create-wrapper">
                    <input
                        type="text"
                        placeholder="Search by title, description, subtitle..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="search-input"
                    />
                    <button
                        onClick={openCreateModal}
                        className="btn btn-primary create-btn"
                    >
                        + Create Recommendation
                    </button>
                </div>

                <table
                    className="recomedation-table table-hover"
                    style={{ width: "100%" }}
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Subtitle</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length ? (
                            paginatedData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{item.subtitle || "-"}</td>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => openEditModal(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(item.id)}
                                            style={{ marginLeft: 8 }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    No recommendations found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div
                    className="pagination-controls"
                    style={{ marginTop: 15, textAlign: "center" }}
                >
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="btn btn-secondary btn-sm"
                    >
                        Prev
                    </button>
                    <span style={{ margin: "0 10px" }}>
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="btn btn-secondary btn-sm"
                    >
                        Next
                    </button>
                </div>

                {showModal && (
                    <div className="modal-backdrop">
                        <div className="modal-content">
                            <h3>
                                {modalMode === "create"
                                    ? "Create Recommendation"
                                    : "Edit Recommendation"}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Title:
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Subtitle:
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={form.subtitle}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Description:
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Image:
                                    <input type="file" name="image" onChange={handleChange} />
                                </label>
                                {form.image && (
                                    <div style={{ marginTop: 10 }}>
                                        <strong>Preview:</strong>
                                        <br />
                                        <img
                                            src={URL.createObjectURL(form.image)}
                                            alt="Preview"
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: "cover",
                                                marginTop: 5,
                                            }}
                                        />
                                    </div>
                                )}
                                <label>
                                    Button Label:
                                    <input
                                        type="text"
                                        name="button_label"
                                        value={form.button_label}
                                        onChange={handleChange}
                                    />
                                </label>
                                {/* <label>
                                    Button Link:
                                    <input
                                        type="text"
                                        name="button_link"
                                        value={form.button_link}
                                        onChange={handleChange}
                                    />
                                </label> */}

                                <div
                                    style={{
                                        marginTop: 20,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn btn-secondary"
                                        disabled={actionLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading
                                            ? modalMode === "create"
                                                ? "Creating..."
                                                : "Updating..."
                                            : modalMode === "create"
                                                ? "Create"
                                                : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RecommendationsEngine;
