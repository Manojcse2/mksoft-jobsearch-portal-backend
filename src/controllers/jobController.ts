import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { SavedJob } from '../models/SavedJob';
import { AuthRequest } from '../middleware/auth';

export const searchJobs = async (req: Request, res: Response) => {
  try {
    const {
      query = '',
      location = '',
      contractType = '',
      page = 1,
      limit = 10,
    } = req.query;

    const filter: any = { isActive: true };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (contractType) {
      filter.contractType = contractType;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ postedDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('postedBy', 'companyName firstName lastName'),
      Job.countDocuments(filter),
    ]);

    res.json({
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecommendedJobs = async (req: AuthRequest, res: Response) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ postedDate: -1 })
      .limit(10)
      .populate('postedBy', 'companyName firstName lastName');
    
    res.json(jobs);
  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'companyName firstName lastName email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user?._id,
    });
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};