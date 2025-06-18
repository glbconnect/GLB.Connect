import { useState } from 'react'

const ApplicationRequirementsForm = ({ formData, updateFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    updateFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-2 text-gray-600 text-sm">
        Fields marked <span className="text-red-500">*</span> are mandatory
      </div>

      <div className="space-y-4">
        {/* Required Skills */}
        <div>
          <label htmlFor="requiredSkills" className="block text-gray-700 font-medium mb-2">
            Required Skills
          </label>
          <textarea
            id="requiredSkills"
            name="requiredSkills"
            value={formData.requiredSkills || ''}
            onChange={handleChange}
            placeholder="List the skills required for this position..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="minExperience" className="block text-gray-700 font-medium mb-2">
              Minimum Experience (years)
            </label>
            <input
              type="number"
              id="minExperience"
              name="minExperience"
              value={formData.minExperience || ''}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="maxExperience" className="block text-gray-700 font-medium mb-2">
              Maximum Experience (years)
            </label>
            <input
              type="number"
              id="maxExperience"
              name="maxExperience"
              value={formData.maxExperience || ''}
              onChange={handleChange}
              placeholder="10"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Education */}
        <div>
          <label htmlFor="education" className="block text-gray-700 font-medium mb-2">
            Education Requirements
          </label>
          <input
            type="text"
            id="education"
            name="education"
            value={formData.education || ''}
            onChange={handleChange}
            placeholder="e.g., Bachelor's degree in Computer Science"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Application Deadline */}
        <div>
          <label htmlFor="deadline" className="block text-gray-700 font-medium mb-2">
            Application Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Application Method */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Application Method<span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['website', 'email', 'in-person'].map((method) => (
              <label key={method} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="applicationMethod"
                  checked={formData.applicationMethod === method}
                  onChange={() => updateFormData({ ...formData, applicationMethod: method })}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="capitalize">{method.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Application Link */}
        <div>
          <label htmlFor="applicationLink" className="block text-gray-700 font-medium mb-2">
            Application Link<span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="applicationLink"
            name="applicationLink"
            value={formData.applicationLink || ''}
            onChange={handleChange}
            placeholder="https://example.com/apply"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Application Email */}
        <div>
          <label htmlFor="applicationEmail" className="block text-gray-700 font-medium mb-2">
            Application Email
          </label>
          <input
            type="email"
            id="applicationEmail"
            name="applicationEmail"
            value={formData.applicationEmail || ''}
            onChange={handleChange}
            placeholder="jobs@company.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  )
}

export default ApplicationRequirementsForm 