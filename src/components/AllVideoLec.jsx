import React, { useEffect, useState } from "react";
import axios from "axios";

function AllVideoLec() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get("http://159.65.153.139:8000/api/videos-lecture/all");
                const formatted = response.data.map(video => ({
                    _id: video._id,
                    title: video.title,
                    url: `http://159.65.153.139:8000/uploads/${video.videoFile}`,  // Local file
                    uploadedAt: new Date(video.uploadedAt).toLocaleDateString()
                }));
                setVideos(formatted);
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
                            <video controls className="w-full h-60 rounded-lg mb-4">
                                <source src={video.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
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
