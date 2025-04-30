import React from "react";

const Features = () => {
  return (
    <div className="bg-[#E4F1F6] py-16">
      {/* Benefits Section */}
      <div className="container mx-auto px-4 mb-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why this App benefits the students?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full hover:bg-blue-200 transition-colors duration-300 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Builds a Supportive Community</h3>
            <p className="text-gray-600">
              By fostering interaction, GLB.Connect reduces the gap between juniors and seniors, where students can freely exchange ideas and knowledge.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-100 p-4 rounded-full hover:bg-pink-200 transition-colors duration-300 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Empowers Introverted Students</h3>
            <p className="text-gray-600">
              Through anonymous posts and private chats, introverted students can seek help and advice comfortably without fear of judgment and connect with other students easily.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full hover:bg-green-200 transition-colors duration-300 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Improves Career Guidance</h3>
            <p className="text-gray-600">
              The app connects juniors with seniors who share insights on internships, placements, and career paths, guiding them through choices that align with their goals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our main features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-yellow-50 p-4 rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="bg-white rounded-full py-2 px-6 shadow-md w-full text-center group-hover:bg-blue-50 transition-colors duration-300">
              <span className="text-blue-600 font-medium">Q&A Threads</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-blue-50 p-4 rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="bg-white rounded-full py-2 px-6 shadow-md w-full text-center group-hover:bg-blue-50 transition-colors duration-300">
              <span className="text-blue-600 font-medium">Job Portal</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-green-50 p-4 rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="bg-white rounded-full py-2 px-6 shadow-md w-full text-center group-hover:bg-blue-50 transition-colors duration-300">
              <span className="text-blue-600 font-medium">Resource Sharing</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-purple-50 p-4 rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="bg-white rounded-full py-2 px-6 shadow-md w-full text-center group-hover:bg-blue-50 transition-colors duration-300">
              <span className="text-blue-600 font-medium">Anonymous Posting</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 5 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-blue-50 p-4 rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="bg-white rounded-full py-2 px-6 shadow-md w-full text-center group-hover:bg-blue-50 transition-colors duration-300">
              <span className="text-blue-600 font-medium">Alumni Network</span>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-green-50 p-4 rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="bg-white rounded-full py-2 px-6 shadow-md w-full text-center group-hover:bg-blue-50 transition-colors duration-300">
              <span className="text-blue-600 font-medium">Live Sessions</span>
            </div>
          </div>

          {/* Feature 7 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="bg-indigo-50 p-4 rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="bg-white rounded-full py-2 px-6 shadow-md w-full text-center group-hover:bg-blue-50 transition-colors duration-300">
              <span className="text-blue-600 font-medium">Event Hub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
