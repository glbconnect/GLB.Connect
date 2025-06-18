import React from "react";

const FeedbackSection = () => {
  return (
    <div className="bg-blue-500 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Give your valuable feedback to encourage us...</h2>
        <p className="mb-8">750K Students daily learn with GLB.Connect. Join now</p>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <input
            type="text"
            placeholder="Enter Your Feedback"
            className="px-6 py-3 rounded-full text-black w-full md:w-auto md:flex-grow max-w-md"
          />
          <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-900 transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection; 