import React, { useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "./dashboard.css";
import { useNavigate } from 'react-router-dom';
import defaultUser from "../../assets/images/user.jpg";

const Dashboard = () => {
    const revenueData = [
        { month: "Jan", value: 30000 },
        { month: "Feb", value: 50000 },
        { month: "Mar", value: 120000 },
        { month: "Apr", value: 80000 },
        { month: "May", value: 100000 },
        { month: "Jun", value: 130000 },
    ];

    const guestTraffic = [
        { time: "10min", female: 200, male: 200 },
        { time: "20min", female: 250, male: 200 },
        { time: "40min", female: 150, male: 150 },
        { time: "60min", female: 200, male: 150 },
        { time: "80min", female: 180, male: 120 },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="dashboard-container">

            {/* Summary cards */}
            <div className="summary-cards">
                {/* Male Guest */}
                <div className="card teal">
                    <div className="card-header">
                        <span className="icon">♂</span>
                        <h6>Total Male</h6>
                    </div>
                    <div className="card-stats">
                        <div>
                            {/* <p>Total invites</p> */}
                            <h2>1,200</h2>
                        </div>
                        <div className="divider"></div>
                        <div>
                            {/* <p>Total come</p>
                            <h2>800</h2> */}
                        </div>
                    </div>
                </div>

                {/* Wedding Date - Invites */}
                <div className="card purple">
                    <div className="card-header">
                        <span className="icon">♀</span>
                        <h6>Total female</h6>
                    </div>
                    <div className="card-stats">
                        <div>
                            {/* <p>Total invites</p> */}
                            <h2>1,050</h2>
                        </div>
                        <div className="divider"></div>
                        {/* <div>
                            <p>Total come</p>
                            <h2>750</h2>
                        </div> */}
                    </div>
                </div>

                {/* Wedding Date - Countdown */}
                <div className="card indigo">
                    <div className="card-header">
                        <span className="icon">💍</span>
                        <h6>Total users</h6>
                    </div>
                    <div className="card-date">
                        {/* <h2>Jan 19, 2025</h2> */}
                        <p>20</p>
                    </div>
                </div>
            </div>




            {/* Stats cards */}

            {/* <div className="stats-cards">
                <div className="card white-card">
                    <h6>Total Weddings</h6>
                    <h2>150</h2>
                    <span className="growth positive">+10% Then Last Month</span>
                </div>
                <div className="card white-card">
                    <h6>Total Earnings</h6>
                    <h2>$30,000</h2>
                    <span className="growth positive">+5% Then Last Month</span>
                </div>
            </div> */}

            {/* Reminders + User activity + Upcoming */}

            {/* <div className="top-section">
                <div className="card white-card reminder-card">
                    <h6>Reminders</h6>
                    <p className="text-muted">You have 3 reminders today</p>
                    <div className="reminder-item">
                        Confirm client payments and...
                        <span className="reminder-time">11:00 AM</span>
                    </div>
                </div>

                <div className="card white-card user-activity">
                    <h6>User activity</h6>
                    <p className="text-muted">You have 6 New client this week</p>
                    <div className="activity-list">
                        <div className="activity-item">
                         
                            <img
                                src={"/assets/images/user.jpg"}
                                alt="User"
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultUser; }}
                            />


                            <div>
                                <h6>Nathan</h6>
                                <span className="badge package elegant">Elegant Package</span>
                            </div>
                            <span className="time">30 min</span>
                        </div>
                        <div className="activity-item">
                            <img
                                src={"/assets/images/user.jpg"}
                                alt="User"
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultUser; }}
                            />
                            <div>
                                <h6>Christian</h6>
                                <span className="badge package premium">Premium Package</span>
                            </div>
                            <span className="time">40 min</span>
                        </div>
                        <div className="activity-item">
                            <img
                                src={"/assets/images/user.jpg"}
                                alt="User"
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultUser; }}
                            />
                            <div>
                                <h6>Dylan</h6>
                                <span className="badge package basic">Basic Package</span>
                            </div>
                            <span className="time">1h 30m</span>
                        </div>
                    </div>
                </div>

                <div className="card white-card upcoming-weddings">
                    <h6 className="text-center">Number of Upcoming Weddings</h6>
                    <h1 className="text-center fw-bold">75</h1>
                    <div className="upcoming-list">
                        <div className="upcoming-item">
                            <img
                                src={"/assets/images/user.jpg"}
                                alt="User"
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultUser; }}
                            />
                            <div>
                                <h6>Dylan</h6>
                                <span className="badge package basic">Basic Package</span>
                            </div>
                            <span className="date">05/20/2025</span>
                        </div>
                        <div className="upcoming-item">
                            <img
                                src={"/assets/images/user.jpg"}
                                alt="User"
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultUser; }}
                            />
                            <div>
                                <h6>Nathan</h6>
                                <span className="badge package elegant">Elegant Package</span>
                            </div>
                            <span className="date">05/30/2025</span>
                        </div>
                        <div className="upcoming-item">
                            <img
                                src={"/assets/images/user.jpg"}
                                alt="User"
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultUser; }}
                            />
                            <div>
                                <h6>Christian</h6>
                                <span className="badge package premium">Premium Package</span>
                            </div>
                            <span className="date">06/10/2025</span>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Charts */}

            {/* <div className="charts">
                <div className="card white-card">
                    <h6>Overview Revenue</h6>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#6366f1" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card white-card">
                    <h6>Visitor traffic</h6>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#color)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div> */}

            {/* Guest Traffic and Booking List */}

            {/* <div className="charts">
                <div className="card white-card">
                    <h6>Guest Traffic</h6>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={guestTraffic}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="female" stackId="a" fill="#f472b6" />
                            <Bar dataKey="male" stackId="a" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div> */}

            {/* <div className="card white-card">
                    <h6>Booking List</h6>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Wedding Date</th>
                                <th>Package</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>John Doe</td>
                                <td>Sep 16, 2025</td>
                                <td>Basic</td>
                                <td>+1 123 456 485</td>
                                <td><span className="badge active">Active</span></td>
                            </tr>
                            <tr>
                                <td>Jane Smith</td>
                                <td>Sep 15, 2025</td>
                                <td>Elegant</td>
                                <td>+1 458 426 757</td>
                                <td><span className="badge completed">Completed</span></td>
                            </tr>
                            <tr>
                                <td>Steven Kim</td>
                                <td>Sep 01, 2025</td>
                                <td>Premium</td>
                                <td>+1 158 456 965</td>
                                <td><span className="badge cancelled">Cancelled</span></td>
                            </tr>
                            <tr>
                                <td>Martin Lee</td>
                                <td>Oct 03, 2025</td>
                                <td>Premium</td>
                                <td>+1 459 148 965</td>
                                <td><span className="badge cancelled">Cancelled</span></td>
                            </tr>
                        </tbody>
                    </table> */}
        </div>



    );
};

export default Dashboard;
