import React, { useState } from 'react';

const EVENT_TYPES = [
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'session', label: 'Session' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'other', label: 'Other' },
];

const EventForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : '',
    location: initialData?.location || '',
    eventType: initialData?.eventType || '',
    registrationLimit: initialData?.registrationLimit || '',
    image: null,
    imageUrl: initialData?.imageUrl || '',
    registrationLink: initialData?.registrationLink || '',
  });
  const [preview, setPreview] = useState(initialData?.imageUrl || '');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(f => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-3 py-2" rows={3} />
      </div>
      <div>
        <label className="block font-medium mb-1">Date & Time</label>
        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Location</label>
        <input name="location" value={form.location} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Event Type</label>
        <select name="eventType" value={form.eventType} onChange={handleChange} required className="w-full border rounded px-3 py-2">
          <option value="">Select type</option>
          {EVENT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Registration Limit</label>
        <input type="number" name="registrationLimit" value={form.registrationLimit} onChange={handleChange} min="1" className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block font-medium mb-1">Google Form Link</label>
        <input
          name="registrationLink"
          type="url"
          value={form.registrationLink}
          onChange={handleChange}
          placeholder="https://forms.gle/..."
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Event Image</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full" />
        {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded" disabled={loading}>
        {loading ? 'Saving...' : 'Save Event'}
      </button>
    </form>
  );
};

export default EventForm; 