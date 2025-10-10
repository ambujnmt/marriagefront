import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import './relationsipprogres.css';

const Relationship = () => {
    const [streaksData, setStreaksData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        axios.get('https://site2demo.in/marriageapp/api/relationship-progres-list')
            .then((response) => {
                const data = response.data.data.map((item) => ({
                    ...item,
                    created_at: new Date(item.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    }),
                }));
                setStreaksData(data);
                setFilteredData(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch streak data. Please try again later.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const lowerSearch = searchText.toLowerCase();
        const filtered = streaksData.filter((item) =>
            item.user_name.toLowerCase().includes(lowerSearch) ||
            item.user_email.toLowerCase().includes(lowerSearch)
        );
        setFilteredData(filtered);
    }, [searchText, streaksData]);

    const columns = [
        { name: 'User Name', selector: row => row.user_name, sortable: true },
        { name: 'Email', selector: row => row.user_email, sortable: true },
        { name: 'Streak Days', selector: row => row.streak_days, sortable: true },
        { name: 'Points', selector: row => row.points, sortable: true },
        { name: 'Tier', selector: row => row.tier, sortable: true },
        { name: 'Progress (%)', selector: row => row.progress_percent, sortable: true },
        { name: 'Description', selector: row => row.description, sortable: false },
        { name: 'Date', selector: row => row.created_at, sortable: true },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f1f1f1',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '15px',
                padding: '12px',
            },
        },
        cells: {
            style: {
                padding: '10px',
                fontSize: '14px',
            },
        },
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="relationship-container">
            <h3>Relationship Progress</h3>

            <div className="datatable-search-wrapper">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="datatable-search"
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                responsive
                dense
                persistTableHead
                striped
                customStyles={customStyles}
            />
        </div>
    );
};

export default Relationship;
