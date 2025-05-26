// /src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import FullScreenSkeleton from "../components/FullScreenSkeleton";
import TeacherDashboard from "../components/TeacherDashboard";
import StudentDashboard from "../components/StudentDashboard";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    setLoading(false); // Simulate loading delay if needed
  }, []);

  if (loading) return <FullScreenSkeleton />;

  if (role === "teacher") {
    return <TeacherDashboard />;
  } else if (role === "student") {
    return <StudentDashboard />;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        <p>No valid role found. Please log in again.</p>
      </div>
    );
  }
};

export default Home;
