import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // only if routing by id
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // const userId = localStorage.getItem("user"); // or get from JWT decode if using token-based ID
  const userId = "682b6f39bcb35c3d8e01ec2a";
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Profile</h2>
      <div className="space-y-3">
        <div>
          <strong>Name:</strong> <span>{user.name}</span>
        </div>
        <div>
          <strong>Email:</strong> <span>{user.email}</span>
        </div>
        <div>
          <strong>Role:</strong> <span>{user.isTeacher ? "Teacher" : "Student"}</span>
        </div>
        <div>
          <strong>Joined On:</strong> <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
