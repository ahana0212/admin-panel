import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Users, ClipboardList, FileCheck } from 'lucide-react';

function TeacherDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Check All Students',
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      onClick: () => navigate('/teacher/students'),
    },
    {
      title: 'Create Assignment',
      icon: <ClipboardList className="h-8 w-8 text-indigo-600" />,
      onClick: () => navigate('/teacher/create-assignment'),
    },
    {
      title: 'Create Meeting',
      icon: <Video className="h-8 w-8 text-indigo-600" />,
      onClick: () => navigate('/teacher/create-meeting'),
    },
    {
      title: 'Upload Video Lecture',
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      onClick: () => navigate('/teacher/upload-lecture'),
    },
    {
      title: 'Check Uploaded Assignments',
      icon: <FileCheck className="h-8 w-8 text-indigo-600" />,
      onClick: () => navigate('/teacher/check-submissions'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Teacher Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className="cursor-pointer p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border hover:border-indigo-600"
          >
            <div className="flex items-center space-x-4">
              {card.icon}
              <h2 className="text-lg font-semibold text-gray-700">
                {card.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherDashboard;
