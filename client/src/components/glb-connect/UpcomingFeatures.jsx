import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FeatureCard from './FeatureCard';
import { 
  CodeBracketIcon, 
  MagnifyingGlassIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const upcomingFeatures = [
  {
    icon: CodeBracketIcon,
    title: 'HalloCode',
    description: 'Choose your preferred programming language and practice DSA fundamentals with structured problems and guidance.'
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Lost & Found',
    description: 'Report lost items, find misplaced belongings, and connect directly with students who found them inside your campus.'
  },
  {
    icon: UserGroupIcon,
    title: 'MentorsHub',
    description: 'Find mentors from alumni and placed students, attend sessions, and get real guidance for your career.'
  }
];

const UpcomingFeatures = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
            Upcoming Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Powerful features we're building to make your college journey easier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {upcomingFeatures.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingFeatures;

