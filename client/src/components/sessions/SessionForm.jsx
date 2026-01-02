import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SessionForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    scheduledAt: initialData.scheduledAt 
      ? new Date(initialData.scheduledAt).toISOString().slice(0, 16)
      : ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
    }
    
    if (!formData.scheduledAt) {
      newErrors.scheduledAt = 'Date and time are required';
    } else {
      const selectedDate = new Date(formData.scheduledAt);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.scheduledAt = 'Session must be scheduled for a future time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSubmit({
      ...formData,
      scheduledAt: new Date(formData.scheduledAt).toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          type="text"
          name="title"
          label="Session Title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., React Hooks Workshop"
          error={errors.title}
          fullWidth
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Topic / Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this session will cover..."
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <div className="text-xs text-red-500 mt-1">{errors.description}</div>
        )}
      </div>

      <div>
        <Input
          type="datetime-local"
          name="scheduledAt"
          label="Date & Time"
          value={formData.scheduledAt}
          onChange={handleChange}
          error={errors.scheduledAt}
          fullWidth
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Select the date and time when the session will start
        </p>
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200"
          loading={loading}
          disabled={loading}
        >
          {initialData.id ? 'Update Session' : 'Create Session'}
        </Button>
      </div>
    </form>
  );
};

export default SessionForm;

