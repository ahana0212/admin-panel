import React from "react";
import { useNavigate } from "react-router-dom";

function LoginType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-600 via-white-600 to-white-500 animate-gradient bg-[length:400%_400%]">
      <div className="relative w-full max-w-2xl p-8 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl transition duration-300 ease-in-out border border-black/60 flex flex-col items-center">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-500/30 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-500/30 rounded-full blur-xl"></div>

        <h2 className="text-4xl font-extrabold text-center text-black mb-10 tracking-tight">
          Cloud Class
        </h2>
        <p className="text-center text-black/80 mb-10">
          Choose your role to continue
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {/* Teacher Box */}
          <div
            onClick={() => navigate("/login?role=teacher")}
            className="cursor-pointer bg-white/30 hover:bg-white/40 border-2 border-black/30 rounded-2xl p-6 flex flex-col items-center justify-center text-black shadow-lg transition-all duration-200 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H5m7 0h7"
              />
            </svg>
            <h3 className="text-xl font-semibold">Login as Teacher</h3>
          </div>

          {/* Student Box */}
          <div
            onClick={() => navigate("/login?role=student")}
            className="cursor-pointer bg-white/30 hover:bg-white/40 border-2 border-black/30 rounded-2xl p-6 flex flex-col items-center justify-center text-black shadow-lg transition-all duration-200 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-xl font-semibold">Login as Student</h3>
          </div>
        </div>

        <p className="mt-10 text-xs text-white/60 text-center">
          &copy; {new Date().getFullYear()} Cloud Class. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LoginType;
