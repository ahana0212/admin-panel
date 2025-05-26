import React, { useState } from "react";

function UploadAssignment() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage("Please provide both title and file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      setSubmitting(true);
      const res = await fetch("/api/assignments/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setMessage("Assignment uploaded successfully!");
      setTitle("");
      setFile(null);
    } catch (err) {
      setMessage("Failed to upload assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">Upload Assignment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Assignment Title</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Upload File</label>
            <input
              type="file"
              className="w-full"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.txt"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200"
          >
            {submitting ? "Uploading..." : "Upload Assignment"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </div>
  );
}

export default UploadAssignment;
