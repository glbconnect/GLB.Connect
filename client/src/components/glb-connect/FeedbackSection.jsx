import React, { useState } from 'react';
import Button from '../ui/Button';

const FeedbackSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFeedback('');
    setName('');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      // Here you would send feedback to the backend (not implemented)
      setFeedback('');
      setName('');
      setShowModal(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Have Feedback or a Suggestion?
        </h2>
        <p className="text-lg text-blue-100 dark:text-purple-200 mb-8 max-w-2xl mx-auto">
          We are always looking to improve. Share your thoughts and help us make GLB.Connect even better for everyone.
        </p>
        <div className="max-w-lg mx-auto">
          <Button 
            variant="white" 
            size="lg"
            className="bg-white text-blue-600 font-bold rounded-full transition-transform transform hover:scale-105 mx-auto"
            onClick={handleOpenModal}
          >
            Submit Feedback
          </Button>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-md relative">
              <button onClick={handleCloseModal} className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <h3 className="text-2xl font-bold mb-4 text-center">Your Feedback</h3>
              <form onSubmit={handleSubmit}>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  type="text"
                  placeholder="Your Name (optional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={4}
                  placeholder="Enter your feedback..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full bg-blue-600 text-white font-bold rounded-full py-2">Submit</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection; 