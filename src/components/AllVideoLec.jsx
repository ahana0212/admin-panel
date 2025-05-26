import React, { useEffect, useState } from "react";

function AllVideoLec() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your actual API call
        const fetchVideos = async () => {
            try {
                // Simulate fetch delay
                const mockData = [
                    {
                        _id: "1",
                        title: "Introduction to React",
                        url: "https://www.youtube.com/embed/dGcsHMXbSOA",
                        uploadedAt: "2025-05-25",
                    },
                    {
                        _id: "2",
                        title: "Node.js Basics",
                        url: "https://www.youtube.com/embed/TlB_eWDSMt4",
                        uploadedAt: "2025-05-24",
                    },
                ];
                setVideos(mockData);
            } catch (err) {
                console.error("Error loading videos", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
                All Video Lectures
            </h1>

            {loading ? (
                <div className="text-center text-gray-500">Loading videos...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {videos.map((video) => (
                        <div key={video._id} className="bg-white rounded-xl shadow-md p-4">
                            <div className="aspect-w-16 aspect-h-9 mb-4">
                                <iframe
                                    src={video.url}
                                    title={video.title}
                                    allowFullScreen
                                    className="w-full h-60 rounded-lg"
                                ></iframe>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">{video.title}</h2>
                            <p className="text-sm text-gray-500">Uploaded on: {video.uploadedAt}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllVideoLec;
