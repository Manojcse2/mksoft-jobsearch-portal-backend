import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { SavedJob, ISavedJob } from '../models/SavedJob';
import { Application } from '../models/Application';
import { Job } from '../models/Job';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    
    // Get setup checklist status
    const setupChecklist = {
      jobTitle: !!user?.currentJobTitle,
      workExperience: !!user?.workExperience,
      professionalSummary: !!user?.professionalSummary,
      personalityQuestionnaire: user?.personalityCompleted || false,
    };
    
    res.json({ user, setupChecklist });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSetupChecklist = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      req.body,
      { new: true }
    );
    res.json(req.body);
  } catch (error) {
    console.error('Update checklist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const savedJobFilter = { userId } as any;
    const savedJobs = await SavedJob.find(savedJobFilter)
      .populate('jobId')
      .sort({ savedAt: -1 });
    
    const jobs = savedJobs.map(sj => sj.jobId);
    res.json(jobs);
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const saveJob = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const paramJobId = req.params.jobId;
    const jobId = typeof paramJobId === 'string' ? paramJobId : String(paramJobId);

    if (!userId || !jobId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const saveJobFilter = { userId, jobId } as any;
    const existing = await SavedJob.findOne(saveJobFilter);
    
    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    
    await SavedJob.create({
      userId,
      jobId,
    });
    
    const populated = await SavedJob.findOne(saveJobFilter).populate('jobId');
    res.json(populated);
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const unsaveJob = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const paramJobId = req.params.jobId;
    const jobId = typeof paramJobId === 'string' ? paramJobId : String(paramJobId);

    if (!userId || !jobId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const deleteFilter = {
      userId,
      jobId,
    } as any;
    await SavedJob.findOneAndDelete(deleteFilter);
    res.json({ message: 'Job unsaved successfully' });
  } catch (error) {
    console.error('Unsave job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};