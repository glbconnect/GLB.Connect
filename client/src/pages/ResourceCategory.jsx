import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import YearCard from '../components/resource-sharing/YearCard';

const categoryTitles = {
  'academics-notes': 'Academic Notes',
  'gate-notes': 'Gate Notes',
  'quantum': 'Quantum',
  'placement-resources': 'Placement Resources',
  'others': 'Others'
};

const yearData = [
  { year: 1 },
  { year: 2 },
  { year: 3 },
  { year: 4 }
];

const ResourceCategory = ({ isLoggedIn, onLogout, currentUser }) => {
  const { categoryName } = useParams();
  const title = categoryTitles[categoryName] || 'Resources';

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600">
            Select a year to browse resources
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {yearData.map((item) => (
            <YearCard 
              key={item.year}
              year={item.year}
              categoryName={categoryName}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ResourceCategory; 