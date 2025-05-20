// /src/components/FullScreenSkeleton.jsx
import React from "react";

const FullScreenSkeleton = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-60 z-40">
      <div className="animate-pulse space-y-4 w-11/12 max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <div className="h-8 bg-gray-300 rounded-md"></div>
        <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
        <div className="mt-4 space-y-2">
          <div className="h-40 bg-gray-300 rounded-md"></div>
          <div className="h-40 bg-gray-300 rounded-md"></div>
          <div className="h-40 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenSkeleton;
