import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CheckuploadedAssignment() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const token = localStorage.getItem("jwt");
                const response = await axios.get('http://localhost:8000/api/uploaded-assignment/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(response)
                setAssignments(response.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch assignments");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading submissions...</p>;
    if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">Uploaded Assignments</h2>

            {assignments.length === 0 ? (
                <p className="text-center text-gray-600">No submissions found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b">Student Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Assignment Title</th>
                                <th className="py-2 px-4 border-b">Submission Date</th>
                                <th className="py-2 px-4 border-b">Attachment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{item.studentName}</td>
                                    <td className="py-2 px-4 border-b">{item.email}</td>
                                    <td className="py-2 px-4 border-b">{item.assignmentTitle}</td>
                                    <td className="py-2 px-4 border-b">
                                        {new Date(item.submittedAt).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            View File
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CheckuploadedAssignment;
