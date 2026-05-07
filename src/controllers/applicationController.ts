import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Application, IApplication } from '../models/Application';
import { Job } from '../models/Job';

export const applyForJob = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { coverLetter } = req.body;
    const paramJobId = req.params.jobId;
    const jobId = typeof paramJobId === 'string' ? paramJobId : String(paramJobId);

    if (!userId || !jobId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applicationFilter = { userId, jobId } as any;
    const existing = await Application.findOne(applicationFilter);
    
    if (existing) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }
    
    await Application.create({
      userId,
      jobId,
      coverLetter,
    });
    
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });
    
    const populated = await Application.findOne(applicationFilter).populate('jobId');
    res.json(populated);
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applicationListFilter = { userId } as any;
    const applications = await Application.find(applicationListFilter)
      .populate('jobId')
      .sort({ appliedAt: -1 });
    
    const jobs = applications.map(app => app.jobId);
    res.json(jobs);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};