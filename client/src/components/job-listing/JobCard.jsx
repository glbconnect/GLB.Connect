import { formatDistanceToNow } from 'date-fns'

const JobCard = ({ job }) => {
  // Format the salary information
  const formatSalary = (salaryObj) => {
    if (!salaryObj) return 'Not disclosed'
    
    const { currency, type, minAmount, maxAmount } = salaryObj
    
    // Handle cases where salary might not be complete
    if (!minAmount && !maxAmount) return `${currency} Not disclosed`
    if (minAmount && !maxAmount) return `${currency} ${minAmount.toLocaleString()} ${type}`
    if (!minAmount && maxAmount) return `Up to ${currency} ${maxAmount.toLocaleString()} ${type}`
    
    // Full salary range
    return `${currency} ${minAmount.toLocaleString()} - ${maxAmount.toLocaleString()} ${type}`
  }
  
  // Format posted date
  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently'
    
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return 'Recently'
    }
  }
  
  // Get application status
  const isOpen = job.isOpen !== false // Default to open if not specified
  
  // Get application link from requirements or fallback
  const getApplicationLink = () => {
    // Check if applicationLink is directly on the job
    if (job.applicationLink) {
      return job.applicationLink
    }
    
    // Check if applicationLink is in requirements
    if (job.requirements && job.requirements.applicationLink) {
      return job.requirements.applicationLink
    }
    
    // Fallback to applicationUrl in requirements if application link is not available
    if (job.requirements && job.requirements.applicationUrl) {
      return job.requirements.applicationUrl
    }
    
    // Return null if no link is found
    return null
  }
  
  // Handle apply button click
  const handleApply = (e) => {
    const applicationLink = getApplicationLink()
    if (!applicationLink) {
      e.preventDefault()
      alert('Application link not available for this job.')
    }
  }
  
  return (
    <div className="bg-white p-6 mb-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <div className="mb-2 md:mb-0">
          <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
          <p className="text-gray-600">
            {job.companyName || job.company} 
            {(job.companyLogo || job.companyWebsite) && (
              <span className="text-sm text-gray-500"> | {job.locations || job.location}</span>
            )}
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
            {job.opportunityType || 'Full Time'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {job.locations || job.location} ({job.workplaceType || job.locationType})
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {typeof job.salary === 'object' ? formatSalary(job.salary) : (job.salary || 'Not disclosed')}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Posted {job.postedAt ? formatPostedDate(job.postedAt) : (job.postedDate || 'Recently')} • 
          <span className={isOpen ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
            {isOpen ? 'Accepting applications' : 'Applications closed'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <a 
          href={getApplicationLink()} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={handleApply}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isOpen 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isOpen}
        >
          {isOpen ? 'Apply Now' : 'Applications Closed'}
        </a>
      </div>
    </div>
  )
}

export default JobCard 