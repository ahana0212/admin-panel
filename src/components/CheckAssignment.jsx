import React, { useEffect, useState } from "react";

function CheckAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://159.65.153.139:8000/api/assignment");
        if (!response.ok) throw new Error("Failed to fetch assignments");
        const data = await response.json();
        setAssignments(data.assignments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        Assignments
      </h1>

      {loading && <p className="text-center text-gray-500">Loading assignments...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto max-w-5xl mx-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Due Date</th>
                <th className="py-3 px-6 text-left">Uploaded On</th>
                <th className="py-3 px-6 text-left">Download</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No assignments found.
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{assignment.title}</td>
                    <td className="py-3 px-6">{assignment.description}</td>
                    <td className="py-3 px-6">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6">
                      <a
                        href={`http://159.65.153.139:8000/uploads/${assignment.assignmentFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CheckAssignment;

