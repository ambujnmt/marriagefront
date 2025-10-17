import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import './WeaklyAnswer.css';

const WeaklyAnswer = () => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetch('https://site2demo.in/marriageapp/api/weakly-answer-list')
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    setAnswers(data.data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching answers:', error);
                setLoading(false);
            });
    }, []);

    const columns = [
        {
            name: <span className="table-header">#</span>,
            selector: (row, index) => index + 1,
            width: '60px',
        },
        {
            name: <span className="table-header">Question</span>,
            selector: row => row.question?.question || 'No question data',
            sortable: true,
            wrap: true,
        },
        {
            name: <span className="table-header">Answer</span>,
            selector: row => row.answer,
            sortable: true,
            wrap: true,
        },
        {
            name: <span className="table-header">User</span>,
            selector: row => row.user.first_name,
            sortable: true,
        },
        {
            name: <span className="table-header">Email</span>,
            selector: row => row.user.email,
        },
        {
            name: <span className="table-header">Date</span>,
            selector: row => new Date(row.created_at).toLocaleString(),
            sortable: true,
        },
    ];

    const filteredItems = answers.filter(
        item =>
            item.question?.question?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.answer?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.user?.first_name?.toLowerCase().includes(filterText.toLowerCase()) ||
            item.user?.email?.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="weakly-answer-container">
            <h2>Weekly Answers</h2>

            <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
            />

            <DataTable
                className="weakly-custom-data-table"
                columns={columns}
                data={filteredItems}
                progressPending={loading}
                pagination
                responsive
                highlightOnHover
                striped
                dense
                noDataComponent="No answers available."
            />
        </div>
    );
};

export default WeaklyAnswer;
