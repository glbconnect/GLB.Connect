import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { getEvents, createEvent, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent, uploadFile, SERVER_URL } from '../services/api';
import { subscribeToEventUpdates } from '../services/socket';
import EventForm from '../components/events/EventForm';
import EventCard from '../components/events/EventCard';
import EventSlideshow from '../components/events/EventSlideshow';

const transformEventImageUrl = (event) => ({
  ...event,
  imageUrl: event.imageUrl ? `${SERVER_URL}${event.imageUrl}` : null,
});

const sortAndFilterEvents = (events) => {
  const now = new Date();
  const upcoming = events
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = events
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  return { upcoming, past };
};

const Events = ({ isLoggedIn, onLogout, currentUser }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAndSetEvents();
    subscribeToEventUpdates({
      onNewEvent: (event) => setUpcomingEvents(prev => [transformEventImageUrl(event), ...prev].sort((a, b) => new Date(a.date) - new Date(b.date))),
      onUpdateEvent: (event) => fetchAndSetEvents(),
      onDeleteEvent: () => fetchAndSetEvents(),
      onRegister: () => fetchAndSetEvents(),
      onUnregister: () => fetchAndSetEvents(),
    });
  }, []);

  const fetchAndSetEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      if (res.data) {
        const transformedEvents = res.data.map(transformEventImageUrl);
        const { upcoming, past } = sortAndFilterEvents(transformedEvents);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      }
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const isUserRegistered = (event) => currentUser && (event.registrations || []).some(r => r.userId === currentUser.id);
  const isAdminOrOrganizer = (event) => currentUser && (currentUser.role === 'admin' || event.organizerId === currentUser.id);

  const handleRegister = async (eventId) => {
    setRegistering({ ...registering, [eventId]: true });
    try { await registerForEvent(eventId); } 
    catch (err) { alert('Failed to register'); } 
    finally { setRegistering({ ...registering, [eventId]: false }); }
  };

  const handleUnregister = async (eventId) => {
    setRegistering({ ...registering, [eventId]: true });
    try { await unregisterFromEvent(eventId); } 
    catch (err) { alert('Failed to unregister'); } 
    finally { setRegistering({ ...registering, [eventId]: false }); }
  };

  const handleSubmitEvent = async (formData) => {
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl || '';
      if (formData.image) {
        const uploadResult = await uploadFile(formData.image);
        imageUrl = uploadResult.url;
      }
      const eventData = { ...formData, imageUrl, registrationLimit: Number(formData.registrationLimit) || null };
      if (isEditing) {
        await updateEvent(selectedEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }
      setShowCreate(false);
      setIsEditing(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Detailed error saving event:', err);
      alert('Failed to save event. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure?')) return;
    try { await deleteEvent(eventId); }
    catch (err) { alert('Failed to delete event'); }
  };

  const openDetail = (event) => { setSelectedEvent(event); setShowDetail(true); };
  const closeDetail = () => { setSelectedEvent(null); setShowDetail(false); };
  const openCreateModal = () => { setIsEditing(false); setSelectedEvent({}); setShowCreate(true); };
  const openEditModal = (event) => { setIsEditing(true); setSelectedEvent(event); setShowCreate(true); };

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout} currentUser={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section with Slideshow */}
          <div className="mb-16">
            <EventSlideshow events={upcomingEvents} onSlideClick={openDetail} />
          </div>

          {/* Create Event Button */}
          <div className="flex justify-end items-center mb-12">
            {currentUser && (
              <Button 
                onClick={openCreateModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                ✨ Create Event
              </Button>
            )}
          </div>

          {/* Upcoming Events Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Upcoming Events
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onCardClick={openDetail} 
                    onRegister={handleRegister} 
                    onUnregister={handleUnregister} 
                    onEdit={openEditModal} 
                    onDelete={handleDelete} 
                    isRegistered={isUserRegistered(event)} 
                    isOrganizer={isAdminOrOrganizer(event)} 
                    registering={registering[event.id]} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No upcoming events</h3>
                <p className="text-gray-500">Be the first to create an exciting event!</p>
              </div>
            )}
          </section>

          {/* Past Events Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent mb-4">
                Past Events
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto rounded-full"></div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
              </div>
            ) : pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onCardClick={openDetail} 
                    onRegister={handleRegister} 
                    onUnregister={handleUnregister} 
                    onEdit={openEditModal} 
                    onDelete={handleDelete} 
                    isRegistered={isUserRegistered(event)} 
                    isOrganizer={isAdminOrOrganizer(event)} 
                    registering={registering[event.id]} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No recent past events</h3>
                <p className="text-gray-500">Past events will appear here once they're completed.</p>
              </div>
            )}
          </section>
        </div>

        {/* Modal Overlay */}
        {(showCreate || showDetail) && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300">
              <button 
                className="absolute top-4 right-4 text-3xl font-bold text-gray-400 hover:text-gray-600 transition-colors duration-200" 
                onClick={() => { setShowCreate(false); setShowDetail(false); }}
              >
                ×
              </button>
              
              {showCreate && (
                <>
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {isEditing ? 'Edit Event' : 'Create Event'}
                  </h2>
                  <EventForm initialData={selectedEvent} onSubmit={handleSubmitEvent} loading={loading} />
                </>
              )}
              
              {showDetail && selectedEvent && (
                <>
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {selectedEvent.title}
                  </h2>
                  <div className="space-y-6">
                    <img 
                      src={selectedEvent.imageUrl || 'https://via.placeholder.com/600x300'} 
                      alt={selectedEvent.title} 
                      className="w-full h-80 object-cover rounded-xl shadow-lg" 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-700">📅 Date:</span>
                        <p className="text-gray-600">{new Date(selectedEvent.date).toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-700">📍 Location:</span>
                        <p className="text-gray-600">{selectedEvent.location}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="font-semibold text-blue-800 mb-2">Description</h3>
                      <p className="text-blue-700 leading-relaxed">{selectedEvent.description}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events; 