import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import student1 from '../../assets/aimad.png';
import student2 from '../../assets/student2.png';
import student3 from '../../assets/student3.png';

const testimonials = [
  {
    quote: "GLB.Connect has been a game-changer. I found a mentor who guided me through my final year project and helped me land my first internship!",
    name: "Aimad Sarwar",
    role: "AIDS, 4th Year",
    avatar: student1
  },
  {
    quote: "As a junior, I was overwhelmed. The anonymous Q&A feature allowed me to ask 'silly' questions without fear. It's an invaluable resource.",
    name: "Rahul Verma",
    role: "Mechanical Eng., 2nd Year",
    avatar: student2
  },
  {
    quote: "The resource sharing section is amazing. I found all the notes and previous year papers I needed for my exams. Highly recommended!",
    name: "Anjali Singh",
    role: "Electronics, 3rd Year",
    avatar: student3
  }
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.2,
      ease: "easeOut"
    }
  })
};

const Testimonials = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
            Loved by Students
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Hear what our community members have to say about their experience on GLB.Connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl text-blue-500 dark:text-blue-400 mb-6">
                "
              </div>
              <blockquote className="flex-1 text-gray-600 dark:text-gray-300 italic mb-6">
                {testimonial.quote}
              </blockquote>
              <div className="flex items-center">
                <img className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-blue-200 dark:border-blue-700" src={testimonial.avatar} alt={testimonial.name} />
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 