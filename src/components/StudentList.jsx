import React, { useEffect, useState } from "react";
import { getAllStundet } from "../apis/dashboard";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await getAllStundet();
      const allUsers = res;
      const onlyStudents = allUsers.filter(user => !user.isTeacher);
      setStudents(onlyStudents);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">All Students</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl shadow-md">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Joined On</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center px-6 py-4 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;
