import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

export const getJobs = async (req, res) => {
    try {
        const {showOpenOnly: showOpenOnly, opportunityType: opportunityType, locations: locations, industry: industry, workplaceType: workplaceType, salary: salary, skills: skills, experience: experience, search: search} = req.query;
        const filters = {};
        if (showOpenOnly === "true") {
            filters.isOpen = true;
        }
        if (opportunityType && opportunityType.length > 0) {
            filters.opportunityType = {
                in: Array.isArray(opportunityType) ? opportunityType : [ opportunityType ]
            };
        }
        if (locations) {
            filters.locations = {
                contains: locations,
                mode: "insensitive"
            };
        }
        if (industry) {
            filters.industry = {
                contains: industry,
                mode: "insensitive"
            };
        }
        if (workplaceType && workplaceType.length > 0) {
            filters.workplaceType = {
                in: Array.isArray(workplaceType) ? workplaceType : [ workplaceType ]
            };
        }
        if (search) {
            filters.OR = [ {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            }, {
                companyName: {
                    contains: search,
                    mode: "insensitive"
                }
            }, {
                locations: {
                    contains: search,
                    mode: "insensitive"
                }
            }, {
                industry: {
                    contains: search,
                    mode: "insensitive"
                }
            } ];
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
                postedAt: "desc"
            }
        });
        res.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

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
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        res.json(job);
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const createJob = async (req, res) => {
    try {
        const {title: title, companyName: companyName, companyWebsite: companyWebsite, companyDescription: companyDescription, contactName: contactName, contactEmail: contactEmail, contactPhone: contactPhone, description: description, locations: locations, industry: industry, workplaceType: workplaceType, opportunityType: opportunityType, salaryCurrency: salaryCurrency, salaryType: salaryType, salaryMin: salaryMin, salaryMax: salaryMax, requiredSkills: requiredSkills, minExperience: minExperience, maxExperience: maxExperience, education: education, deadline: deadline, applicationMethod: applicationMethod, applicationEmail: applicationEmail, applicationUrl: applicationUrl, applicationLink: applicationLink, applicationInPersonDetails: applicationInPersonDetails} = req.body;
        const userId = req.user.id;
        if (!applicationLink) {
            return res.status(400).json({
                message: "Application link is required"
            });
        }
        const job = await prisma.job.create({
            data: {
                title: title,
                companyName: companyName,
                companyWebsite: companyWebsite,
                companyDescription: companyDescription,
                contactName: contactName,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                description: description,
                locations: locations,
                industry: industry,
                workplaceType: workplaceType,
                opportunityType: opportunityType,
                postedBy: userId,
                salary: {
                    create: {
                        currency: salaryCurrency || "INR",
                        type: salaryType || "per year",
                        minAmount: salaryMin ? parseFloat(salaryMin) : null,
                        maxAmount: salaryMax ? parseFloat(salaryMax) : null
                    }
                },
                requirements: {
                    create: {
                        skills: requiredSkills,
                        minExperience: minExperience ? parseInt(minExperience) : null,
                        maxExperience: maxExperience ? parseInt(maxExperience) : null,
                        education: education,
                        applicationDeadline: deadline ? new Date(deadline) : null,
                        applicationMethod: applicationMethod || "website",
                        applicationEmail: applicationEmail,
                        applicationUrl: applicationUrl,
                        applicationLink: applicationLink,
                        applicationInPersonDetails: applicationInPersonDetails
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
        });
        res.status(201).json(job);
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        const userId = req.user.id;
        const existingJob = await prisma.job.findUnique({
            where: {
                id: jobId
            },
            include: {
                user: true
            }
        });
        if (!existingJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        if (existingJob.postedBy !== userId) {
            return res.status(403).json({
                message: "Not authorized to update this job"
            });
        }
        const {title: title, companyName: companyName, companyWebsite: companyWebsite, companyDescription: companyDescription, contactName: contactName, contactEmail: contactEmail, contactPhone: contactPhone, description: description, locations: locations, industry: industry, workplaceType: workplaceType, opportunityType: opportunityType, isOpen: isOpen, salaryCurrency: salaryCurrency, salaryType: salaryType, salaryMin: salaryMin, salaryMax: salaryMax, requiredSkills: requiredSkills, minExperience: minExperience, maxExperience: maxExperience, education: education, deadline: deadline, applicationMethod: applicationMethod, applicationEmail: applicationEmail, applicationUrl: applicationUrl, applicationLink: applicationLink, applicationInPersonDetails: applicationInPersonDetails} = req.body;
        const updatedJob = await prisma.job.update({
            where: {
                id: jobId
            },
            data: {
                title: title,
                companyName: companyName,
                companyWebsite: companyWebsite,
                companyDescription: companyDescription,
                contactName: contactName,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                description: description,
                locations: locations,
                industry: industry,
                workplaceType: workplaceType,
                opportunityType: opportunityType,
                isOpen: isOpen,
                salary: {
                    upsert: {
                        create: {
                            currency: salaryCurrency || "INR",
                            type: salaryType || "per year",
                            minAmount: salaryMin ? parseFloat(salaryMin) : null,
                            maxAmount: salaryMax ? parseFloat(salaryMax) : null
                        },
                        update: {
                            currency: salaryCurrency || "INR",
                            type: salaryType || "per year",
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
                            education: education,
                            applicationDeadline: deadline ? new Date(deadline) : null,
                            applicationMethod: applicationMethod || "website",
                            applicationEmail: applicationEmail,
                            applicationUrl: applicationUrl,
                            applicationLink: applicationLink,
                            applicationInPersonDetails: applicationInPersonDetails
                        },
                        update: {
                            skills: requiredSkills,
                            minExperience: minExperience ? parseInt(minExperience) : null,
                            maxExperience: maxExperience ? parseInt(maxExperience) : null,
                            education: education,
                            applicationDeadline: deadline ? new Date(deadline) : null,
                            applicationMethod: applicationMethod || "website",
                            applicationEmail: applicationEmail,
                            applicationUrl: applicationUrl,
                            applicationLink: applicationLink,
                            applicationInPersonDetails: applicationInPersonDetails
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
        });
        res.json(updatedJob);
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        const userId = req.user.id;
        const existingJob = await prisma.job.findUnique({
            where: {
                id: jobId
            }
        });
        if (!existingJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }
        if (existingJob.postedBy !== userId) {
            return res.status(403).json({
                message: "Not authorized to delete this job"
            });
        }
        await prisma.job.delete({
            where: {
                id: jobId
            }
        });
        res.json({
            message: "Job deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobs = await prisma.job.findMany({
            where: {
                postedBy: userId
            },
            include: {
                salary: true,
                requirements: true
            },
            orderBy: {
                postedAt: "desc"
            }
        });
        res.json(jobs);
    } catch (error) {
        console.error("Error fetching user jobs:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};