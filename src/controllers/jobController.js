import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const {
      showOpenOnly,
      opportunityType,
      locations,
      industry,
      workplaceType,
      salary,
      skills,
      experience,
      search
    } = req.query

    // Build filter conditions
    const filters = {}

    // Add open status filter
    if (showOpenOnly === 'true') {
      filters.isOpen = true
    }

    // Add opportunity type filter
    if (opportunityType && opportunityType.length > 0) {
      filters.opportunityType = {
        in: Array.isArray(opportunityType) ? opportunityType : [opportunityType]
      }
    }

    // Add location filter (fuzzy search)
    if (locations) {
      filters.locations = {
        contains: locations,
        mode: 'insensitive'
      }
    }

    // Add industry filter (fuzzy search)
    if (industry) {
      filters.industry = {
        contains: industry,
        mode: 'insensitive'
      }
    }

    // Add workplace type filter
    if (workplaceType && workplaceType.length > 0) {
      filters.workplaceType = {
        in: Array.isArray(workplaceType) ? workplaceType : [workplaceType]
      }
    }

    // Add search query across multiple fields
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { locations: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } }
      ]
    }

    const jobs = await prisma.job.findMany({
      where: filters,
      include: {
        salary: true,
        requirements: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        postedAt: 'desc'
      }
    })

    res.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: parseInt(req.params.id)
      },
      include: {
        salary: true,
        requirements: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (requires authentication)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      companyName,
      companyWebsite,
      companyDescription,
      contactName,
      contactEmail,
      contactPhone,
      description,
      locations,
      industry,
      workplaceType,
      opportunityType,
      salaryCurrency,
      salaryType,
      salaryMin,
      salaryMax,
      requiredSkills,
      minExperience,
      maxExperience,
      education,
      deadline,
      applicationMethod,
      applicationEmail,
      applicationUrl,
      applicationLink,
      applicationInPersonDetails
    } = req.body

    // Get user ID from authenticated request
    const userId = req.user.id

    // Validate required fields
    if (!applicationLink) {
      return res.status(400).json({ message: 'Application link is required' });
    }

    // Create job with nested relations
    const job = await prisma.job.create({
      data: {
        title,
        companyName,
        companyWebsite,
        companyDescription,
        contactName,
        contactEmail,
        contactPhone,
        description,
        locations,
        industry,
        workplaceType,
        opportunityType,
        postedBy: userId, // Link to authenticated user
        salary: {
          create: {
            currency: salaryCurrency || 'INR',
            type: salaryType || 'per year',
            minAmount: salaryMin ? parseFloat(salaryMin) : null,
            maxAmount: salaryMax ? parseFloat(salaryMax) : null
          }
        },
        requirements: {
          create: {
            skills: requiredSkills,
            minExperience: minExperience ? parseInt(minExperience) : null,
            maxExperience: maxExperience ? parseInt(maxExperience) : null,
            education,
            applicationDeadline: deadline ? new Date(deadline) : null,
            applicationMethod: applicationMethod || 'website',
            applicationEmail,
            applicationUrl,
            applicationLink,
            applicationInPersonDetails
          }
        }
      },
      include: {
        salary: true,
        requirements: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.status(201).json(job)
  } catch (error) {
    console.error('Error creating job:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (job owner only)
export const updateJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id)
    const userId = req.user.id

    // Check if job exists and user owns it
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: { user: true }
    })

    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (existingJob.postedBy !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' })
    }

    const {
      title,
      companyName,
      companyWebsite,
      companyDescription,
      contactName,
      contactEmail,
      contactPhone,
      description,
      locations,
      industry,
      workplaceType,
      opportunityType,
      isOpen,
      salaryCurrency,
      salaryType,
      salaryMin,
      salaryMax,
      requiredSkills,
      minExperience,
      maxExperience,
      education,
      deadline,
      applicationMethod,
      applicationEmail,
      applicationUrl,
      applicationLink,
      applicationInPersonDetails
    } = req.body

    // Update job with nested relations
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        companyName,
        companyWebsite,
        companyDescription,
        contactName,
        contactEmail,
        contactPhone,
        description,
        locations,
        industry,
        workplaceType,
        opportunityType,
        isOpen,
        salary: {
          upsert: {
            create: {
              currency: salaryCurrency || 'INR',
              type: salaryType || 'per year',
              minAmount: salaryMin ? parseFloat(salaryMin) : null,
              maxAmount: salaryMax ? parseFloat(salaryMax) : null
            },
            update: {
              currency: salaryCurrency || 'INR',
              type: salaryType || 'per year',
              minAmount: salaryMin ? parseFloat(salaryMin) : null,
              maxAmount: salaryMax ? parseFloat(salaryMax) : null
            }
          }
        },
        requirements: {
          upsert: {
            create: {
              skills: requiredSkills,
              minExperience: minExperience ? parseInt(minExperience) : null,
              maxExperience: maxExperience ? parseInt(maxExperience) : null,
              education,
              applicationDeadline: deadline ? new Date(deadline) : null,
              applicationMethod: applicationMethod || 'website',
              applicationEmail,
              applicationUrl,
              applicationLink,
              applicationInPersonDetails
            },
            update: {
              skills: requiredSkills,
              minExperience: minExperience ? parseInt(minExperience) : null,
              maxExperience: maxExperience ? parseInt(maxExperience) : null,
              education,
              applicationDeadline: deadline ? new Date(deadline) : null,
              applicationMethod: applicationMethod || 'website',
              applicationEmail,
              applicationUrl,
              applicationLink,
              applicationInPersonDetails
            }
          }
        }
      },
      include: {
        salary: true,
        requirements: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.json(updatedJob)
  } catch (error) {
    console.error('Error updating job:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (job owner only)
export const deleteJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id)
    const userId = req.user.id

    // Check if job exists and user owns it
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (existingJob.postedBy !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job' })
    }

    // Delete job (cascade will handle related records)
    await prisma.job.delete({
      where: { id: jobId }
    })

    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get jobs posted by current user
// @route   GET /api/jobs/my-jobs
// @access  Private
export const getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id

    const jobs = await prisma.job.findMany({
      where: {
        postedBy: userId
      },
      include: {
        salary: true,
        requirements: true
      },
      orderBy: {
        postedAt: 'desc'
      }
    })

    res.json(jobs)
  } catch (error) {
    console.error('Error fetching user jobs:', error)
    res.status(500).json({ message: 'Server error' })
  }
} 