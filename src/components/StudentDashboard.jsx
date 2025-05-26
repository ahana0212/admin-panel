import React from 'react';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
    const navigate = useNavigate();

    const cards = [
        {
            title: "All Video Lectures",
            description: "Watch your course lectures anytime.",
            onClick: () => navigate("/student/video-lectures"),
        },
        {
            title: "Check Assignments",
            description: "View and download assignments given by teachers.",
            onClick: () => navigate("/student/assignments"),
        },
        {
            title: "Join Meeting",
            description: "Join live class sessions or discussions.",
            onClick: () => window.open("https://meet.google.com/hso-ygrx-fmn", "_blank"),
        },
        {
            title: "Upload Assignment",
            description: "Submit your completed assignments here.",
            onClick: () => navigate("/student/upload-assignment"),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
                Student Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        onClick={card.onClick}
                        className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
                    >
                        <h2 className="text-xl font-semibold text-indigo-600">{card.title}</h2>
                        <p className="mt-2 text-gray-600">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentDashboard;
