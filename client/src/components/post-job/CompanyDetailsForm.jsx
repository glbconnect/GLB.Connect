import { useState } from 'react'

const CompanyDetailsForm = ({ formData, updateFormData, prevStep, submitForm, isSubmitting, submitError }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    updateFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitForm()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-2 text-gray-600 text-sm">
        Fields marked <span className="text-red-500">*</span> are mandatory
      </div>

      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-gray-700 font-medium mb-2">
            Company Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName || ''}
            onChange={handleChange}
            placeholder="Enter company name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Company Website */}
        <div>
          <label htmlFor="companyWebsite" className="block text-gray-700 font-medium mb-2">
            Company Website
          </label>
          <input
            type="url"
            id="companyWebsite"
            name="companyWebsite"
            value={formData.companyWebsite || ''}
            onChange={handleChange}
            placeholder="https://company.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Company Description */}
        <div>
          <label htmlFor="companyDescription" className="block text-gray-700 font-medium mb-2">
            Company Description
          </label>
          <textarea
            id="companyDescription"
            name="companyDescription"
            value={formData.companyDescription || ''}
            onChange={handleChange}
            placeholder="Brief description about the company..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-gray-700 font-medium mb-2">
              Contact Person Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName || ''}
              onChange={handleChange}
              placeholder="Enter contact person name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-gray-700 font-medium mb-2">
              Contact Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail || ''}
              onChange={handleChange}
              placeholder="contact@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Contact Phone */}
        <div>
          <label htmlFor="contactPhone" className="block text-gray-700 font-medium mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone || ''}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

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
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg transition-colors ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Posting...' : 'Post Opportunity'}
        </button>
      </div>
    </form>
  )
}

export default CompanyDetailsForm 