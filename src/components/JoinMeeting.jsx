import React, { useEffect, useState } from "react";
import axios from "axios";

function JoinMeeting() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const res = await axios.get("http://localhost:8000/api/meetings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMeetings(res.data.meetings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Join Meeting</h1>

      {loading && <p className="text-center text-gray-500">Loading meetings...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && meetings.length === 0 && (
        <p className="text-center text-gray-500">No meetings available.</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                  {meeting.title || "Class Meeting"}
                </h2>
                <p className="text-gray-600 mb-2">
                  <strong>Class Code:</strong> {meeting.classCode}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Created At:</strong> {new Date(meeting.createdAt).toLocaleString()}
                </p>
              </div>
              <a
                href={meeting.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto bg-indigo-600 text-white text-center py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
              >
                Join Now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JoinMeeting;
