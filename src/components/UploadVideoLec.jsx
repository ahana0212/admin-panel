import React, { useState } from 'react';
import axios from 'axios';

function UploadVideoLec() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !description || !videoFile) {
            setError("All fields are required.");
            return;
        }
        const user = localStorage.getItem("user");
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("uploadedBy", user )
        formData.append("videoFile", videoFile);

        try {
            setLoading(true);
            const token = localStorage.getItem("jwt");
            const response = await axios.post("http://localhost:8000/api/videos-lecture/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage("Video uploaded successfully!");
            setTitle("");
            setDescription("");
            setVideoFile(null);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 border shadow rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">Upload Video Lecture</h2>
            <form onSubmit={handleUpload} className="space-y-4">
                <div>
                    <label className="block font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter title"
                    />
                </div>

                <div>
                    <label className="block font-medium">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter description"
                    />
                </div>

                <div>
                    <label className="block font-medium">Video File (MP4)</label>
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        className="w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
}

export default UploadVideoLec;
