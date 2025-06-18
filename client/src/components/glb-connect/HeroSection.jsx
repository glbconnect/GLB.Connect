import React from "react";

const HeroSection = () => {
  return (
    <>
      <section className="bg-[#E4F1F6] py-16 md:py-20 overflow-hidden w-full">
        <div className="w-full px-4 relative">
          <div className="flex flex-col md:flex-row items-center max-w-[1400px] mx-auto">
            {/* Text Content */}
            <div className="w-full md:w-[40%] mb-10 md:mb-0 relative z-30">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-4">
                From newcomers to navigators - connecting students to succeed together.
              </h1>
              <p className="text-lg text-gray-800 mt-4 max-w-md">
                A real-time platform designed to help juniors in college connect with seniors for personalized guidance.
              </p>
              <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors">
                Login/Sign Up
              </button>
            </div>
            
            {/* Image Container - Completely separated from text */}
            <div className="w-full md:w-[60%] flex justify-center md:justify-end">
              <div className="relative md:mr-[-20px] lg:mr-0 md:ml-16">
                <div className="flex justify-center">
                  <div className="relative flex space-x-[-30px]">
                    {/* First Image */}
                    <div className="h-[200px] w-[200px] md:h-[220px] md:w-[220px] lg:h-[250px] lg:w-[250px] bg-blue-600 rounded-full overflow-hidden border-4 border-white relative">
                      <img 
                        src="/firstperson.png" 
                        className="h-full w-full object-contain object-center scale-[1.3]" 
                        alt="Student 1" 
                      />  
                    </div>
                    {/* Second Image */}
                    <div className="h-[200px] w-[200px] md:h-[220px] md:w-[220px] lg:h-[250px] lg:w-[250px] bg-pink-500 rounded-full overflow-hidden border-4 border-white relative z-10">
                      <img 
                        src="/secondperson.png" 
                        className="h-full w-full object-contain object-center scale-[1.3]" 
                        alt="Student 2" 
                      />  
                    </div>
                    {/* Third Image */}
                    <div className="h-[200px] w-[200px] md:h-[220px] md:w-[220px] lg:h-[250px] lg:w-[250px] bg-teal-500 rounded-full overflow-hidden border-4 border-white relative z-20">
                      <img 
                        src="/thirdperson.png" 
                        className="h-full w-full object-contain object-center scale-[1.3]" 
                        alt="Student 3" 
                      />  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* College names section */}
      <div className="w-full bg-[#4286F5] py-8">
        <div className="w-full px-4">
          <div className="max-w-[1400px] mx-auto flex flex-wrap justify-around items-center gap-6 md:gap-8">
            <span className="text-white text-xl md:text-2xl font-bold">GL Bajaj</span>
            <span className="text-white text-xl md:text-2xl font-bold">Galgotia</span>
            <span className="text-white text-xl md:text-2xl font-bold">NIET</span>
            <span className="text-white text-xl md:text-2xl font-bold">Jamia</span>
            <span className="text-white text-xl md:text-2xl font-bold">Bennett</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
