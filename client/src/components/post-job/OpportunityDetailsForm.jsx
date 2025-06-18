import { useState } from 'react'

const OpportunityDetailsForm = ({ formData, updateFormData, nextStep }) => {
  const [description, setDescription] = useState(formData.description || '')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    updateFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleRadioChange = (name, value) => {
    updateFormData({
      ...formData,
      [name]: value
    })
  }

  const handleDescriptionChange = (e) => {
    const content = e.target.value
    setDescription(content)
    updateFormData({
      ...formData,
      description: content
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
        {/* Opportunity Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Opportunity type<span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['Full Time', 'Internship', 'Contractual / Freelance work', 'Volunteer'].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="opportunityType"
                  checked={formData.opportunityType === type}
                  onChange={() => handleRadioChange('opportunityType', type)}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Opportunity Title */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Opportunity title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Locations */}
        <div>
          <label htmlFor="locations" className="block text-gray-700 font-medium mb-2">
            Locations<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="locations"
            name="locations"
            value={formData.locations || ''}
            onChange={handleChange}
            placeholder="Enter location(s)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-gray-700 font-medium mb-2">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry || ''}
            onChange={handleChange}
            placeholder="Enter industry"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Workplace Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Workplace type<span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {['On-site / Work from office', 'Remote / Work from home', 'Hybrid'].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="workplaceType"
                  checked={formData.workplaceType === type}
                  onChange={() => handleRadioChange('workplaceType', type)}
                  className="text-blue-600 focus:ring-blue-500"
                  required
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Salary
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Currency</label>
              <select
                name="salaryCurrency"
                value={formData.salaryCurrency || 'INR'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <select
                name="salaryType"
                value={formData.salaryType || 'per year'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="per year">per year</option>
                <option value="per month">per month</option>
                <option value="per hour">per hour</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin || ''}
                onChange={handleChange}
                placeholder="Enter min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">-</span>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax || ''}
                onChange={handleChange}
                placeholder="Enter max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Opportunity description<span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe the opportunity, responsibilities, and benefits..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
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

export default OpportunityDetailsForm 