import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center text-center h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600"
    >
      {/* Icon */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
        <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;

