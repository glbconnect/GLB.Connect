import { useState, useEffect } from 'react'

const FilterPanel = ({ onFilterChange, activeFilters }) => {
  const [filters, setFilters] = useState({
    showOpenOnly: false,
    opportunityType: [],
    locations: '',
    industry: '',
    workplaceType: []
  })
  
  // Merge the provided activeFilters with the default state
  useEffect(() => {
    if (activeFilters) {
      const safeActiveFilters = {
        ...activeFilters,
        opportunityType: Array.isArray(activeFilters.opportunityType) ? activeFilters.opportunityType : [],
        workplaceType: Array.isArray(activeFilters.workplaceType) ? activeFilters.workplaceType : []
      }
      setFilters(safeActiveFilters)
    }
  }, [activeFilters])

  const handleCheckboxChange = (filterType, value) => {
    const updatedFilters = { ...filters }
    
    if (filterType === 'showOpenOnly') {
      updatedFilters.showOpenOnly = !updatedFilters.showOpenOnly
    } else if (Array.isArray(updatedFilters[filterType])) {
      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value)
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value]
      }
    }
    
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleTextInputChange = (filterType, value) => {
    const updatedFilters = { ...filters }
    // If clicking the same value again, clear it
    if (updatedFilters[filterType] === value) {
      updatedFilters[filterType] = ''
    } else {
      updatedFilters[filterType] = value
    }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }
  
  // Clear all filters
  const clearAllFilters = () => {
    const resetFilters = {
      showOpenOnly: false,
      opportunityType: [],
      locations: '',
      industry: '',
      workplaceType: []
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }
  
  // Common locations for dropdown
  const commonLocations = [
    'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 
    'Pune', 'Kolkata', 'Ahmedabad', 'Kochi', 'Pan India'
  ]
  
  // Common industries
  const commonIndustries = [
    'Information Technology', 'Banking & Finance', 'Healthcare', 
    'Manufacturing', 'Retail', 'Education', 'Marketing & Advertising',
    'Consulting', 'E-commerce', 'Transportation & Logistics'
  ]

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.showOpenOnly || 
           filters.opportunityType.length > 0 || 
           filters.locations || 
           filters.industry || 
           filters.workplaceType.length > 0;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        {hasActiveFilters() && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Show Open Jobs Only */}
      <div className="border-t border-b border-gray-100 py-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={filters.showOpenOnly}
            onChange={() => handleCheckboxChange('showOpenOnly')}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Show open jobs only</span>
        </label>
      </div>

      {/* Opportunity Type */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Opportunity Type</h3>
        <div className="space-y-2">
          {['Full Time', 'Part Time', 'Internship', 'Contract', 'Freelance'].map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.opportunityType.includes(type)}
                onChange={() => handleCheckboxChange('opportunityType', type)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Location</h3>
        <input
          type="text"
          placeholder="Enter location..."
          value={filters.locations || ''}
          onChange={(e) => handleTextInputChange('locations', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {commonLocations.map(location => (
            <button
              key={location}
              onClick={() => handleTextInputChange('locations', location)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                filters.locations === location
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Industry</h3>
        <input
          type="text"
          placeholder="Enter industry..."
          value={filters.industry || ''}
          onChange={(e) => handleTextInputChange('industry', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {commonIndustries.map(industry => (
            <button
              key={industry}
              onClick={() => handleTextInputChange('industry', industry)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                filters.industry === industry
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Workplace Type */}
      <div>
        <h3 className="font-medium text-gray-800 mb-3">Workplace Type</h3>
        <div className="space-y-2">
          {['On-site', 'Remote', 'Hybrid'].map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.workplaceType.includes(type)}
                onChange={() => handleCheckboxChange('workplaceType', type)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterPanel 