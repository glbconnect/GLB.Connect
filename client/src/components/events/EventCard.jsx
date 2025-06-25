import React from 'react';
import Button from '../ui/Button';

const EventCard = ({ event, onCardClick, onRegister, onUnregister, onEdit, onDelete, isRegistered, isOrganizer, registering }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
      <div onClick={() => onCardClick(event)} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img 
            src={event.imageUrl || 'https://via.placeholder.com/400x200'} 
            alt={event.title} 
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {event.eventType || 'Event'}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {event.title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="text-sm">{event.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="text-sm">{(event.registrations || []).length} registered</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>
      
      <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center pt-4">
          {isRegistered ? (
            <Button 
              disabled={registering} 
              onClick={() => onUnregister(event.id)} 
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Unregister
            </Button>
          ) : (
            event.registrationLink ? (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                style={{ textDecoration: 'none' }}
              >
                Register
              </a>
            ) : (
              <Button 
                disabled={registering} 
                onClick={() => onRegister(event.id)} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Register
              </Button>
            )
          )}
          
          {isOrganizer && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => onEdit(event)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-all duration-200"
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                onClick={() => onDelete(event.id)}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-full transition-all duration-200"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard; 