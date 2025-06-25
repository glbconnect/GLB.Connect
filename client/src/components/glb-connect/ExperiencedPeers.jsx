import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import peer1 from '../../assets/Placement25-AnshGoyal-csaiml.png';
import peer2 from '../../assets/Placement24-AadityaRaj-cseaiml.png';
import peer3 from '../../assets/placement-2025-GouravMandal-IT.png';
import peer4 from '../../assets/Placement25-NikunjGuptaAIML.png';

const peers = [
  { image: peer1, name: "Ansh Goyal", role: "Batch-2025", expertise: "Autodesk" },
  { image: peer2, name: "Aditya Raj", role: "Batch-2025", expertise: "Juspay" },
  { image: peer3, name: "Gourav Mandal", role: "Batch-2025", expertise: "Scale" },
  { image: peer4, name: "Nikunj Gupta", role: "Batch-2025", expertise: "Juspay" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: "easeOut"
    }
  })
};

const ExperiencedPeers = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Connect With Experienced Peers
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We are a passionate group of students committed to enhancing the college experience through peer mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {peers.map((peer, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 h-full flex flex-col text-center items-center transform hover:-translate-y-2">
                <div className="relative mb-6">
                  <img
                    src={peer.image}
                    alt={peer.name}
                    className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-white/20 group-hover:border-white/40 transition-all duration-300"
                  />
                  <span className="absolute bottom-2 right-2 bg-green-500 rounded-full w-4 h-4 border-2 border-gray-800"></span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                    {peer.name}
                  </h3>
                  <p className="text-gray-400 mb-2">{peer.role}</p>
                  <p className="text-sm font-semibold text-blue-300">{peer.expertise}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperiencedPeers; 