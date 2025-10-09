import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import "./PartnerList.css";

const MySwal = withReactContent(Swal);

const Partner = () => {
    const tableRef = useRef(null);
    const dataTableInstance = useRef(null);

    const [partners, setPartners] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({
        user_id: "",
        my_name: "",
        my_partner_name: "",
        mobile: "",
        email: "",
        my_partner_mobile: "",
        my_partner_email: "",
        partner: "",
        password: "",
        password_confirm: "",
        upload_photo: null,
    });

    // ✅ Fetch Partners
    const fetchPartners = async () => {
        try {
            const response = await axios.get("https://site2demo.in/marriageapp/api/partner-list");
            if (response.data?.status && response.data?.data) {
                const fullData = response.data.data.map((p) => ({
                    ...p,
                    image_full_url: p.image
                        ? p.image.startsWith("http")
                            ? p.image
                            : `https://site2demo.in/marriageapp${p.image}`
                        : "https://via.placeholder.com/50",
                }));
                setPartners(fullData);
            } else {
                setPartners([]);
            }
        } catch (error) {
            console.error("Failed to fetch partners:", error);
            toast.error("Failed to load users.");
            setPartners([]);
        }
    };

    // ✅ Initialize DataTable only after data load
    useEffect(() => {
        fetchPartners();
    }, []);

    useEffect(() => {
        if (partners.length > 0) {
            // Destroy old instance
            if (dataTableInstance.current) {
                dataTableInstance.current.destroy();
                dataTableInstance.current = null;
            }

            // Initialize new DataTable
            dataTableInstance.current = $(tableRef.current).DataTable({
                destroy: true,
                retrieve: true,
            });
        }
    }, [partners]);

    // ✅ Delete Partner
    const deletePartner = async (user_id) => {
        const confirmed = await MySwal.fire({
            title: "Are you sure?",
            text: "You will not be able to recover this user!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirmed.isConfirmed) return;

        try {
            await axios.post(
                "https://site2demo.in/marriageapp/api/user-delete",
                { user_id },
                {
                    headers: { Accept: "application/json" },
                }
            );

            toast.success("User deleted successfully!");
            await fetchPartners(); // ✅ Refresh table
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete user. Please try again.");
        }
    };

    // ✅ Open edit modal
    const openEditModal = (partner) => {
        setEditData({
            user_id: partner.id,
            my_name: partner.first_name || "",
            my_partner_name: partner.my_partner_name || "",
            mobile: partner.mobile || "",
            email: partner.email || "",
            my_partner_mobile: partner.my_partner_mobile || "",
            my_partner_email: partner.my_partner_email || "",
            partner: partner.partner || "",
            password: "",
            password_confirm: "",
            upload_photo: null,
        });
        setIsEditOpen(true);
    };

    // ✅ Handle input/file change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setEditData((prev) => ({
            ...prev,
            upload_photo: e.target.files[0] || null,
        }));
    };

    // ✅ Submit Update
    const submitUpdate = async (e) => {
        e.preventDefault();

        if (editData.password !== editData.password_confirm) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const formData = new FormData();
            for (const key in editData) {
                if (editData[key] !== null) {
                    formData.append(key, editData[key]);
                }
            }

            const response = await axios.post(
                "https://site2demo.in/marriageapp/api/profile-update",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    },
                }
            );

            if (response.data.status) {
                toast.success("User updated successfully!");
                setIsEditOpen(false);
                await fetchPartners(); // ✅ Refresh table
            } else {
                toast.error(response.data.message || "Failed to update user.");
            }
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update user. Please try again.");
        }
    };

    return (
        <div className="partner-table-container">
            <h2>User List</h2>

            <table ref={tableRef} className="display partner-table" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Partner</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {partners.map((partner, index) => (
                        <tr key={partner.id}>
                            <td>{index + 1}</td>
                            <td>
                                <img
                                    src={partner.image_full_url}
                                    alt={partner.first_name}
                                    width="50"
                                    height="50"
                                    style={{ borderRadius: "50%", objectFit: "cover" }}
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/50";
                                    }}
                                />
                            </td>
                            <td>{partner.first_name}</td>
                            <td>{partner.partner}</td>
                            <td>{partner.role}</td>
                            <td>{partner.email}</td>
                            <td>{partner.mobile}</td>
                            <td>
                                <button onClick={() => openEditModal(partner)} className="btn edit">
                                    Edit
                                </button>
                                <button onClick={() => deletePartner(partner.id)} className="btn delete">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Edit Modal */}
            {isEditOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edit User</h3>
                        <form onSubmit={submitUpdate}>
                            <div>
                                <label>Your Name:</label>
                                <input
                                    type="text"
                                    name="my_name"
                                    value={editData.my_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Partner Name:</label>
                                <input
                                    type="text"
                                    name="my_partner_name"
                                    value={editData.my_partner_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Mobile:</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={editData.mobile}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Partner Mobile:</label>
                                <input
                                    type="text"
                                    name="my_partner_mobile"
                                    value={editData.my_partner_mobile}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Partner Email:</label>
                                <input
                                    type="email"
                                    name="my_partner_email"
                                    value={editData.my_partner_email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Partner:</label>
                                <select
                                    name="partner"
                                    value={editData.partner}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="husband">Husband</option>
                                    <option value="wife">Wife</option>
                                </select>
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={editData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    name="password_confirm"
                                    value={editData.password_confirm}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Upload Photo:</label>
                                <input
                                    type="file"
                                    name="upload_photo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div style={{ marginTop: "1rem" }}>
                                <button type="submit" className="btn-blue update">
                                    Update
                                </button>
                                <button
                                    type="button"
                                    className="btn-gray cancel"
                                    onClick={() => setIsEditOpen(false)}
                                    style={{ marginLeft: "1rem" }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Partner;
