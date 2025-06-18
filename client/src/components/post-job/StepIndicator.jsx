const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Opportunity details' },
    { id: 2, title: 'Application requirements' },
    { id: 3, title: 'Company details' }
  ]

  return (
    <div className="flex justify-between w-full mb-6">
      {steps.map((step) => (
        <div 
          key={step.id} 
          className={`flex items-center ${step.id !== steps.length ? 'flex-1' : ''}`}
        >
          <div className="relative flex flex-col items-center text-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= step.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-500'
            }`}>
              {step.id}
            </div>
            <div className={`mt-2 text-sm font-medium ${
              currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.title}
            </div>
          </div>
          
          {step.id !== steps.length && (
            <div className={`flex-1 h-px mx-4 ${
              currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default StepIndicator 
 