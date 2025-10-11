import React, { useState, useEffect, useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement, PointElement } from 'chart.js';
import './ResultAnalytics.css';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement, PointElement);

const Resultanalytics = () => {
    const [data, setData] = useState(null);

    const chartRef = useRef(null);

    const BASE_URL = "https://site2demo.in/marriageapp/api";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/all-result-anaylytics-list`);
                const result = await response.json();
                if (result.status) {
                    setData(result);
                } else {
                    console.error('Error fetching data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
    }, [data]);

    const overallScoreData = {
        labels: ['Score'],
        datasets: [
            {
                label: 'Overall Score',
                data: [data?.scores[0].value || 0],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ]
    };

    const trendsData = {
        labels: data?.trends.map(trend => trend.date) || [],
        datasets: [
            {
                label: 'Score Trend',
                data: data?.trends.map(trend => trend.score) || [],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }
        ]
    };

    const progressReportsData = {
        labels: data?.progress_reports.map(report => report.category) || [],
        datasets: [
            {
                data: data?.progress_reports.map(report => report.value) || [],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
            }
        ]
    };

    const weekVsLastWeekData = {
        labels: ['Communication', 'Trust'],
        datasets: [
            {
                label: 'Week vs Last Week',
                data: [
                    parseInt(data?.week_vs_last_week.communication.replace('%', '') || 0),
                    parseInt(data?.week_vs_last_week.trust === 'Stable' ? 0 : data?.week_vs_last_week.trust.replace('%', '') || 0),
                ],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
            }
        ]
    };

    return (
        <div className="result-analytics-container">
            {data ? (
                <div className="charts-container">
                    <div className="left-section">
                        <div className="score-section">
                            <h3>Overall Score</h3>
                            <Bar ref={chartRef} data={overallScoreData} />
                        </div>

                        <div className="trends-section">
                            <h3>Trends</h3>
                            <Line ref={chartRef} data={trendsData} />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="right-section">
                        <div className="progress-reports-section">
                            <h3>Progress Reports</h3>
                            <Pie ref={chartRef} data={progressReportsData} />
                        </div>

                        <div className="week-vs-last-week">
                            <h3>Week vs Last Week</h3>
                            <Bar ref={chartRef} data={weekVsLastWeekData} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loading">Loading...</div>
            )}
        </div>
    );
};

export default Resultanalytics;
