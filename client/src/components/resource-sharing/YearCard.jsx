import React from 'react';
import { Link } from 'react-router-dom';

const YearCard = ({ year, categoryName }) => {
  const getYearImage = (year) => {
    // You can replace these with actual images later
    const yearImages = {
      1: '/public/Year 1.png',
      2: '/public/Year 2.png', 
      3: '/public/Year 3.png',
      4: '/public/Year 4.png'
    };
    return yearImages[year] || '/public/Year 1.png';
  };

  return (
    <Link
      to={`/resources/category/${categoryName}/year/${year}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Year {year}
          </h3>
          <p className="text-gray-600">
            Browse resources for Year {year}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default YearCard; 