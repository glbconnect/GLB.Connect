import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import StepIndicator from '../components/post-job/StepIndicator'
import OpportunityDetailsForm from '../components/post-job/OpportunityDetailsForm'
import ApplicationRequirementsForm from '../components/post-job/ApplicationRequirementsForm'
import CompanyDetailsForm from '../components/post-job/CompanyDetailsForm'
import api from '../services/api'

const PostJob = ({ isLoggedIn, onLogout, currentUser }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [jobResponse, setJobResponse] = useState(null)

  // Check if user is admin
  if (isLoggedIn && currentUser?.role !== 'ADMIN') {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout} currentUser={currentUser}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-8">
              Only Admin users can post jobs. Please contact an administrator if you need to post a job.
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData
    }))
  }

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1)
    window.scrollTo(0, 0)
  }

  const submitForm = async () => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      // Prepare data - ensure we have all required fields with defaults
      const dataToSubmit = {
        ...formData,
        // Default values for required fields
        isOpen: true,
        postedAt: new Date().toISOString()
      }
      
      // Submit to the API using the existing api service
      const response = await api.post('/jobs', dataToSubmit)
      
      console.log('Job posted successfully:', response.data)
      setJobResponse(response.data)
      setIsSubmitSuccess(true)
      
      // Redirect to jobs page after success - with a short delay for feedback
      setTimeout(() => {
        navigate('/jobs')
      }, 3000)
      
      return true
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(error.response?.data?.message || 'Failed to submit job posting')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render the appropriate form step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OpportunityDetailsForm 
            formData={formData} 
            updateFormData={updateFormData} 
            nextStep={nextStep} 
          />
        )
      case 2:
        return (
          <ApplicationRequirementsForm 
            formData={formData} 
            updateFormData={updateFormData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        )
      case 3:
        return (
          <CompanyDetailsForm 
            formData={formData} 
            updateFormData={updateFormData} 
            prevStep={prevStep} 
            submitForm={submitForm}
            isSubmitting={isSubmitting}
            submitError={submitError} 
          />
        )
      default:
        return <div>Invalid step</div>
    }
  }

  if (isSubmitSuccess) {
    return (
      <Layout isLoggedIn={isLoggedIn} onLogout={onLogout} currentUser={currentUser}>
        <div className="container mx-auto py-12">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Opportunity Posted Successfully!</h2>
              <p className="text-gray-600 mb-6">Your job posting has been successfully submitted and is now live.</p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/jobs')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Opportunities
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout} currentUser={currentUser}>
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8 py-4 md:py-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Post an Opportunity</h1>
            
            <StepIndicator currentStep={currentStep} />
            
            {renderStep()}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PostJob 