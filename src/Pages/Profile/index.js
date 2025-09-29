import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Profile.css';

const Profile = () => {
    const storedUserId = localStorage.getItem('user_id');
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState('');

    const [profileData, setProfileData] = useState({
        first_name: '',
        my_partner_name: '',
        mobile: '',
        my_partner_mobile: '',
        email: '',
        address: '',
        password: '',
        user_id: storedUserId || '',
        image_url: '',
    });

    useEffect(() => {
        if (!storedUserId) {
            Swal.fire('Error', 'User not logged in. Please login first.', 'error');
            setLoading(false);
            return;
        }

        axios.post('https://site2demo.in/marriageapp/api/profile-list', { user_id: storedUserId })
            .then(res => {
                if (res.data?.status && res.data.data) {
                    const profile = res.data.data;
                    setProfileData({
                        first_name: profile.first_name || '',
                        my_partner_name: profile.my_partner_name || '',
                        mobile: profile.mobile || '',
                        my_partner_mobile: profile.my_partner_mobile || '',
                        email: profile.email || '',
                        address: profile.address || '',
                        password: '',
                        user_id: storedUserId,
                        image_url: profile.image || '',
                    });
                    setImagePreview(profile.image || '');
                } else {
                    Swal.fire('Error', 'Failed to load profile data', 'error');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Profile fetch error:', err);
                Swal.fire('Error', 'Error fetching profile data', 'error');
                setLoading(false);
            });
    }, [storedUserId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData(prev => ({
                ...prev,
                image_file: file,
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // No password confirmation validation here

        try {
            const formData = new FormData();

            formData.append('first_name', profileData.first_name);
            formData.append('my_partner_name', profileData.my_partner_name);
            formData.append('mobile', profileData.mobile);
            formData.append('my_partner_mobile', profileData.my_partner_mobile);
            formData.append('email', profileData.email);
            formData.append('address', profileData.address);
            formData.append('user_id', profileData.user_id);

            if (profileData.password) {
                formData.append('password', profileData.password);
            }

            if (profileData.image_file) {
                formData.append('upload_photo', profileData.image_file);
            }

            const response = await axios.post('https://site2demo.in/marriageapp/api/profile-update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data?.status) {
                Swal.fire('Success', 'Profile updated successfully', 'success');

                // Update preview and image_url if API returns updated image URL
                if (response.data.data?.image) {
                    setImagePreview(response.data.data.image);
                    setProfileData(prev => ({
                        ...prev,
                        image_url: response.data.data.image,
                        password: '',
                        image_file: null,
                    }));
                }
            } else {
                Swal.fire('Error', response.data.message || 'Update failed', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire('Error', 'Failed to update profile', 'error');
        }
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="profile-container">

            <form className="profile-form" onSubmit={handleSubmit} encType="multipart/form-data">

                <div className="image-preview">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Profile"
                            width={150}
                            height={150}
                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                    ) : (
                        <div style={{ width: 150, height: 150, backgroundColor: '#ccc', borderRadius: '50%' }}>
                            No Image
                        </div>
                    )}
                </div>

                <label>
                    Change Profile Image
                    <input
                        type="file"
                        name="upload_photo"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>

                <label>
                    First Name
                    <input
                        type="text"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        placeholder="Enter First Name"
                    />
                </label>

                <label>
                    Partner Name
                    <input
                        type="text"
                        name="my_partner_name"
                        value={profileData.my_partner_name}
                        onChange={handleInputChange}
                        placeholder="Enter Partner Name"
                    />
                </label>

                <label>
                    Mobile
                    <input
                        type="text"
                        name="mobile"
                        value={profileData.mobile}
                        onChange={handleInputChange}
                        placeholder="Enter Mobile"
                    />
                </label>

                <label>
                    Partner Mobile
                    <input
                        type="text"
                        name="my_partner_mobile"
                        value={profileData.my_partner_mobile}
                        onChange={handleInputChange}
                        placeholder="Enter Partner Mobile"
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        placeholder="Enter Email"
                    />
                </label>


                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={profileData.password}
                        onChange={handleInputChange}
                        placeholder="Leave blank to keep existing password"
                    />
                </label>

                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
