import React, { useState } from "react";
import axios from "axios";

function CreateAssignment() {
    const user  = localStorage.getItem("user");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        attachmentUrl: "",
        _id: user
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        if(loading)
            return;
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            const token = localStorage.getItem("jwt");

            const res = await axios.post(
                "http://159.65.153.139:8000/api/assignment/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data.success) {
                setSuccess("Assignment created successfully!");
                setFormData({
                    title: "",
                    description: "",
                    dueDate: "",
                    attachmentUrl: "",
                });
            } else {
                setError(res.data.message || "Failed to create assignment");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Create New Assignment</h2>

            {success && <p className="text-green-600 mb-4">{success}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Attachment URL (optional)</label>
                    <input
                        type="url"
                        name="attachmentUrl"
                        value={formData.attachmentUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
                >
                    {loading ? "Submitting..." : "Create Assignment"}
                </button>
            </form>
        </div>
    );
}

export default CreateAssignment;
