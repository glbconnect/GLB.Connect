import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, UserCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/glb-connect/Footer';

const TeamCard = ({ name, role, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl border border-gray-100"
  >
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4 text-blue-500 shadow-inner">
        <UserCircle className="w-16 h-16 text-blue-400/80" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
    <p className="text-blue-600 font-medium text-sm mb-3">{role}</p>
    {description && <p className="text-gray-500 text-sm mb-4">{description}</p>}
    
    <div className="flex gap-3 mt-auto">
      <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>
      <a href="#" className="text-gray-400 hover:text-gray-800 transition-colors"><Github size={18} /></a>
    </div>
  </motion.div>
);

const Section = ({ children, className = "" }) => (
  <section className={`py-16 px-4 md:px-8 ${className}`}>
    <div className="max-w-6xl mx-auto">
      {children}
    </div>
  </section>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-20 pb-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            About <span className="text-blue-600">GLB.Connect</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Bridging the gap between juniors, seniors, and alumni to foster a thriving college community.
          </p>
        </motion.div>
      </div>

      {/* Introduction Section */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Building a Stronger Community</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              GLB.Connect is more than just a platform; it's a digital ecosystem designed to unify the students of GL Bajaj Institute. We understand that college life is defined by the connections you make and the guidance you receive.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform serves as a central hub where knowledge flows freely. Whether you're a fresher looking for mentorship, a senior sharing project insights, or an alumni offering career advice, GLB.Connect brings everyone together in a safe and supportive environment.
            </p>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
             className="grid grid-cols-2 gap-4"
          >
            {[
              { title: "Mentorship", desc: "Guidance from experienced peers" },
              { title: "Networking", desc: "Connect with alumni & seniors" },
              { title: "Resources", desc: "Share notes & study materials" },
              { title: "Growth", desc: "Unlock career opportunities" }
            ].map((item, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-700 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Mission & Vision Section */}
      <Section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg backdrop-blur-sm">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              To help students grow through guidance, mentorship, and shared experiences. We aim to remove the barriers between batches and create a culture of helping one another succeed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
             <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg backdrop-blur-sm">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              To build a strong, connected college ecosystem where students support each other beyond academics, fostering lifelong professional relationships and friendships.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Team Section */}
      <Section className="bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet The Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind GLB.Connect, dedicated to making college life better for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <TeamCard 
            name="Muhammad Baqir" 
            role="Founder" 
            description="Visionary leader passionate about community building and tech innovation."
            delay={0.1}
          />
          <TeamCard 
            name="Nisha Ahmad" 
            role="Core Team Member" 
            description="Leading the technical development and ensuring a seamless user experience."
            delay={0.2}
          />
          <TeamCard 
            name="Maahi Dhaka" 
            role="Core Team Member" 
            description="Focused on strategic growth and student outreach initiatives."
            delay={0.3}
          />
          <TeamCard 
            name="Kshitij Dwivedi" 
            role="Core Team Member" 
            description="Technical expertise ensuring the platform runs smoothly."
            delay={0.4}
          />
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default AboutUs;
