import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useNavigate } from 'react-router-dom';
import "./dashboard.css";
import defaultUser from "../../assets/images/user.jpg";

const Dashboard = () => {
    const [partnerData, setPartnerData] = useState([]);
    const [partnerStats, setPartnerStats] = useState([
        { type: "Male (Husband)", count: 0 },
        { type: "Female (Wife)", count: 0 }
    ]);

    const navigate = useNavigate();

    // Redirect to login if not logged in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

    // Fetch partner data from API
    useEffect(() => {
        const fetchPartnerData = async () => {
            try {
                const response = await fetch("https://site2demo.in/marriageapp/api/partner-list");
                const result = await response.json();

                if (result.status && Array.isArray(result.data)) {
                    setPartnerData(result.data);

                    const maleCount = result.data.filter(p => p.partner?.toLowerCase() === "husband").length;
                    const femaleCount = result.data.filter(p => p.partner?.toLowerCase() === "wife").length;

                    setPartnerStats([
                        { type: "Male", count: maleCount },
                        { type: "Female", count: femaleCount }
                    ]);
                } else {
                    console.error("Invalid API response format");
                }
            } catch (error) {
                console.error("Error fetching partner data:", error);
            }
        };

        fetchPartnerData();
    }, []);

    return (
        <div className="dashboard-container">
            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="card teal">
                    <div className="card-header">
                        <span className="icon">♂</span>
                        <h6>Total Male</h6>
                    </div>
                    <div className="card-stats">
                        <h2>{partnerStats[0].count}</h2>
                    </div>
                </div>
                <div className="card purple">
                    <div className="card-header">
                        <span className="icon">♀</span>
                        <h6>Total Female</h6>
                    </div>
                    <div className="card-stats">
                        <h2>{partnerStats[1].count}</h2>
                    </div>
                </div>
                <div className="card indigo">
                    <div className="card-header">
                        <span className="icon">💍</span>
                        <h6>Total Users</h6>
                    </div>
                    <div className="card-date">
                        <p>{partnerData.length}</p>
                    </div>
                </div>
            </div>

            {/* Partner Distribution Bar Chart */}
            <div className="charts">
                <div className="card white-card">
                    <h6>Partner Distribution</h6>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={partnerStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
