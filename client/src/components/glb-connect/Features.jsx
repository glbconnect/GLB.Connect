import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const featuresData = [
  {
    icon: "❓",
    title: "Q&A Threads",
    description: "Get instant answers to your questions from experienced seniors and alumni."
  },
  {
    icon: "💼",
    title: "Job Portal",
    description: "Access exclusive job opportunities and internship listings from top companies."
  },
  {
    icon: "📚",
    title: "Resource Sharing",
    description: "Share and discover study materials, notes, and valuable academic resources."
  },
  {
    icon: "👻",
    title: "Anonymous Posting",
    description: "Ask questions and share concerns anonymously without any hesitation."
  },
  {
    icon: "🎓",
    title: "Alumni Network",
    description: "Connect with successful alumni for mentorship and career guidance."
  },
  {
    icon: "🎙️",
    title: "Live Sessions & Events",
    description: "Join interactive live sessions, workshops, and competitions."
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Features = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
            Why GLB.Connect?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need for a successful college journey, all in one place.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
