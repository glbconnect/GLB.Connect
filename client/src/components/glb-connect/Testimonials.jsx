import React, { useState } from "react";

const Testimonials = () => {
  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Jessica Andrew",
      initial: "J",
      bgColor: "bg-purple-400",
      rating: 5,
      text: "My college journey has been much smoother thanks to the guidance I received on GLB.Connect.",
    },
    {
      id: 2,
      name: "Darlene Robertson",
      initial: "D",
      bgColor: "bg-blue-400",
      rating: 5,
      text: "The peer mentorship helped me improve my programming skills significantly. Seniors on the platform are very supportive.",
    },
    {
      id: 3,
      name: "Dianne Russell",
      initial: "D",
      bgColor: "bg-green-400",
      rating: 5,
      text: "Finding resources and getting advice on GLB.Connect has made a huge difference in my academic performance.",
    },
    {
      id: 4,
      name: "Robert Johnson",
      initial: "R",
      bgColor: "bg-yellow-400",
      rating: 5,
      text: "The mentorship program has been incredibly valuable for my academic growth. Highly recommend!",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
  };

  // Display 3 testimonials at a time on desktop, 1 on mobile
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <div className="bg-[#E4F1F6] py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">What do students say about GLB.Connect?</h2>
        
        <div className="relative">
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hidden md:block"
            onClick={prevTestimonial}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex flex-col md:flex-row gap-6 overflow-hidden">
            {visibleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-md flex-1">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full mr-4 ${testimonial.bgColor} flex items-center justify-center text-white font-bold text-lg`}>
                    {testimonial.initial}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
          
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hidden md:block"
            onClick={nextTestimonial}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Mobile navigation dots */}
        <div className="flex justify-center mt-6 md:hidden">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 mx-1 rounded-full ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 