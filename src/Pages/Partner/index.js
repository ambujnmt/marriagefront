import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PartnerList.css';  // CSS table ke liye neeche diya gaya hai

const Partner = () => {
    const [partners, setPartners] = useState([]);
    const [filteredPartners, setFilteredPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        axios.get('https://site2demo.in/marriageapp/api/partner-list')
            .then(response => {
                if (response.data?.status) {
                    const data = response.data.data;
                    const fullData = data.map(p => ({
                        ...p,
                        image_full_url: p.image.startsWith('http')
                            ? p.image
                            : `https://site2demo.in/marriageapp${p.image}`
                    }));
                    setPartners(fullData);
                    setFilteredPartners(fullData);
                } else {
                    console.error('Partner list response status false');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching partner list:', err);
                setLoading(false);
            });
    }, []);

    const handleFilter = (e) => {
        const text = e.target.value.toLowerCase();
        setSearchText(text);

        if (text === '') {
            setFilteredPartners(partners);
        } else {
            const filtered = partners.filter(p => {
                return (
                    (p.first_name && p.first_name.toLowerCase().includes(text)) ||
                    (p.email && p.email.toLowerCase().includes(text)) ||
                    (p.partner && p.partner.toLowerCase().includes(text)) ||
                    (p.role && p.role.toLowerCase().includes(text))
                );
            });
            setFilteredPartners(filtered);
        }
    };

    if (loading) {
        return <div>Loading partners...</div>;
    }

    return (
        <div className="partner-table-container">
            <h3>Partner List</h3>

            <div className="filter-search">
                <input
                    type="text"
                    placeholder="Search by name, email, role..."
                    value={searchText}
                    onChange={handleFilter}
                />
            </div>

            {filteredPartners.length === 0 ? (
                <div className="no-data">No partners found.</div>
            ) : (
                <div className="table-wrapper">
                    <table className="partner-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Partner</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Mobile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPartners.map((partner, index) => (
                                <tr key={partner.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={partner.image_full_url}
                                            alt={partner.first_name}
                                            width="50"
                                            height="50"
                                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/50';
                                            }}
                                        />
                                    </td>
                                    <td>{partner.first_name}</td>
                                    <td>{partner.partner}</td>
                                    <td>{partner.role}</td>
                                    <td>{partner.email}</td>
                                    <td>{partner.mobile}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Partner;
