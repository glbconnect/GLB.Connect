import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, UserCircle, Users, Target, Eye, Heart, Sparkles, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/glb-connect/Footer';

const TeamCard = ({ name, role, description, delay, linkedinUrl, githubUrl }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl border border-gray-100 group"
  >
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center mb-4 text-blue-500 shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <UserCircle className="w-16 h-16 text-blue-400/80 transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-300">{name}</h3>
    <p className="text-blue-600 font-semibold text-sm mb-2 bg-blue-50 px-3 py-1 rounded-full">{role}</p>
    {description && <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>}
    
    <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100 w-full justify-center">
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-blue-50">
        <Linkedin size={20} />
      </a>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-100">
        <Github size={20} />
      </a>
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
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 pb-16 px-4 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GLB.Connect</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Bridging the gap between juniors, seniors, and alumni to foster a thriving college community.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium">1000+ Students</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-medium">Growing Community</span>
            </div>
          </motion.div>
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
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Our Story</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
              Building a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Stronger Community</span>
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              GLB.Connect is more than just a platform; it's a digital ecosystem designed to unify the students of GL Bajaj Institute. We understand that college life is defined by the connections you make and the guidance you receive.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our platform serves as a central hub where knowledge flows freely. Whether you're a fresher looking for mentorship, a senior sharing project insights, or an alumni offering career advice, GLB.Connect brings everyone together in a safe and supportive environment.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8"
            >
            </motion.div>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
             className="grid grid-cols-2 gap-4"
          >
            {[
              { title: "Mentorship", desc: "Guidance from experienced peers", icon: "👥", color: "blue" },
              { title: "Networking", desc: "Connect with alumni & seniors", icon: "🌐", color: "purple" },
              { title: "Resources", desc: "Share notes & study materials", icon: "📚", color: "green" },
              { title: "Growth", desc: "Unlock career opportunities", icon: "🚀", color: "orange" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 p-6 rounded-2xl border border-${item.color}-200 hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className={`font-bold text-${item.color}-700 mb-2 text-lg`}>{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Mission & Vision Section */}
      <Section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">Our Mission</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
              To help students grow through guidance, mentorship, and shared experiences. We aim to remove the barriers between batches and create a culture of helping one another succeed.
            </p>
            <div className="mt-6 flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
              <span className="text-sm font-medium">Learn about our impact</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
          >
             <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">Our Vision</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
              To build a strong, connected college ecosystem where students support each other beyond academics, fostering lifelong professional relationships and friendships.
            </p>
            <div className="mt-6 flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
              <span className="text-sm font-medium">See our future plans</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Team Section */}
      <Section className="bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-4 shadow-md">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet The <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Brilliant Minds</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              The passionate individuals behind GLB.Connect, dedicated to making college life better for everyone through innovation and collaboration.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <TeamCard 
            name="Muhammad Baqir"  
            description="Visionary leader passionate about community building and tech innovation."
            delay={0.1}
            linkedinUrl="https://linkedin.com/in/muhammad-baqir"
            githubUrl="https://github.com/mb-aarfi"
          />
          <TeamCard 
            name="Nisha Ahmad"
            description="Leading the technical development and ensuring a seamless user experience."
            delay={0.2}
            linkedinUrl="https://linkedin.com/in/nisha-ahmad"
            githubUrl="https://github.com/NAhmad231"
          />
          <TeamCard 
            name="Maahi Dhaka"
            description="Focused on strategic growth and student outreach initiatives."
            delay={0.3}
            linkedinUrl="https://linkedin.com/in/maahi-dhaka"
            githubUrl="https://github.com/maahidhaka"
          />
          <TeamCard 
            name="Kshitij Dwivedi" 
            description="Technical expertise ensuring the platform runs smoothly and efficiently."
            delay={0.4}
            linkedinUrl="https://linkedin.com/in/kshitij-dwivedi"
            githubUrl="https://github.com/Kshitij2145"
          />
        </div>
        
        
      </Section>

      {/* Call to Action Section */}
      <Section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/15 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Be part of something bigger. Connect with fellow students, share knowledge, and grow together in your college journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default AboutUs;
