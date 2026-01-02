import React from 'react';
import Layout from '../components/layout/Layout';
import Footer from '../components/glb-connect/Footer';
import peer1 from '../assets/peer1.png';
import peer2 from '../assets/peer2.png';
import peer3 from '../assets/peer3.png';
import peer4 from '../assets/peer4.png';

const TeamMemberCard = ({ name, role, description, image }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col items-center p-6 text-center border border-gray-100 dark:border-gray-700">
    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-blue-100 dark:border-blue-900">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{name}</h3>
    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">{role}</p>
    {description && (
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Muhammad Baqir",
      role: "Founder",
      description: "Visionary leader passionate about connecting students and fostering a collaborative learning environment.",
      image: peer1
    },
    {
      name: "Nisha Ahmad",
      role: "Core Team Member",
      description: "Dedicated to building a supportive community where every student finds their path to success.",
      image: peer2
    },
    {
      name: "Maahi Dhaka",
      role: "Core Team Member",
      description: "Driving engagement and ensuring the platform meets the real needs of our student body.",
      image: peer3
    },
    {
      name: "Kshitij Dwivedi",
      role: "Core Team Member",
      description: "Focused on technical excellence and creating a seamless user experience for everyone.",
      image: peer4
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
        
        {/* Hero Section */}
        <section className="relative py-20 px-6 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200 blur-3xl mix-blend-multiply"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-purple-200 blur-3xl mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
              About <span className="text-blue-600">GLB.Connect</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Bridging the gap between juniors, seniors, and alumni to create a thriving ecosystem of guidance, mentorship, and opportunity.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-6 bg-white dark:bg-gray-800/50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mr-3">M</span>
                Our Mission
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To help students grow through guidance, mentorship, and shared experiences. We believe that every interaction is an opportunity to learn, and by connecting the right people, we can accelerate personal and professional development for everyone at GL Bajaj.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-purple-50 dark:bg-gray-800 border border-purple-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mr-3">V</span>
                Our Vision
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To build a strong, connected college ecosystem where students support each other beyond academics. We envision a campus where no question goes unanswered, no opportunity is missed, and every student feels supported by a network of peers and mentors.
              </p>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why GLB.Connect?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              College is more than just classes and exams. It's about networking, finding mentors, and preparing for the future. We built GLB.Connect to provide a safe and trusted platform for:
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Guidance & Mentorship", icon: "🎓", desc: "Connect with seniors who have walked the path you're on." },
              { title: "Knowledge Sharing", icon: "💡", desc: "Share resources, notes, and insights to help everyone succeed." },
              { title: "Career Opportunities", icon: "🚀", desc: "Discover internships, jobs, and placement advice." },
              { title: "Safe Networking", icon: "shield", desc: "A verified community exclusively for GL Bajaj students and alumni." } // Changed emoji to text for shield if emoji not supported well, but emoji is fine usually. Using shield emoji 🛡️
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="text-4xl mb-4">{item.icon === "shield" ? "🛡️" : item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section className="py-20 px-6 bg-white dark:bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet the Team</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The passionate individuals behind GLB.Connect, working hard to bring this vision to life.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMemberCard key={index} {...member} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </Layout>
  );
};

export default AboutUs;
