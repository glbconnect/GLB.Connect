import * as eventModel from '../models/eventModel.js';
import { getIO } from '../sockets/chatSocket.js';

export async function getAllEvents(req, res) {
  try {
    const events = await eventModel.getAllEvents();
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch events', error: err.message });
  }
}

export async function getEventById(req, res) {
  try {
    const event = await eventModel.getEventById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch event', error: err.message });
  }
}

export async function createEvent(req, res) {
  try {
    const { title, description, date, location, eventType, registrationLimit, imageUrl, registrationLink } = req.body;
    const dataToSave = {
      title,
      description,
      date: new Date(date),
      location,
      eventType,
      registrationLimit: registrationLimit ? parseInt(registrationLimit, 10) : null,
      imageUrl,
      registrationLink,
      organizerId: req.user.id,
    };
    const event = await eventModel.createEvent(dataToSave);
    getIO().emit('event:new', event);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    console.error('ERROR CREATING EVENT:', err);
    res.status(500).json({ success: false, message: 'Failed to create event', error: err.message });
  }
}

export async function updateEvent(req, res) {
  try {
    const { title, description, date, location, eventType, registrationLimit, imageUrl, registrationLink } = req.body;
    const dataToSave = {
      title,
      description,
      date: date ? new Date(date) : undefined,
      location,
      eventType,
      registrationLimit: registrationLimit ? parseInt(registrationLimit, 10) : null,
      imageUrl,
      registrationLink,
    };
    Object.keys(dataToSave).forEach(key => dataToSave[key] === undefined && delete dataToSave[key]);
    const event = await eventModel.updateEvent(req.params.id, dataToSave);
    getIO().emit('event:update', event);
    res.json({ success: true, data: event });
  } catch (err) {
    console.error('ERROR UPDATING EVENT:', err);
    res.status(500).json({ success: false, message: 'Failed to update event', error: err.message });
  }
}

export async function deleteEvent(req, res) {
  try {
    await eventModel.deleteEvent(req.params.id);
    getIO().emit('event:delete', { id: req.params.id });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete event', error: err.message });
  }
}

export async function registerUser(req, res) {
  try {
    const registration = await eventModel.registerUser(req.params.id, req.user.id);
    getIO().emit('event:register', { eventId: req.params.id, userId: req.user.id });
    res.status(201).json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to register for event', error: err.message });
  }
}

export async function unregisterUser(req, res) {
  try {
    await eventModel.unregisterUser(req.params.id, req.user.id);
    getIO().emit('event:unregister', { eventId: req.params.id, userId: req.user.id });
    res.json({ success: true, message: 'Unregistered from event' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to unregister from event', error: err.message });
  }
}

export async function getRegistrations(req, res) {
  try {
    const registrations = await eventModel.getRegistrations(req.params.id);
    res.json({ success: true, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch registrations', error: err.message });
  }
} 