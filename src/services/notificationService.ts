import { createNotification } from '../controllers/notificationController';
// import Job from '../models/Job';
// import User from '../models/User';

export const notifyJobMatch = async (userId: string, jobId: string, companyName: string) => {
  await createNotification(
    userId,
    'New Job Match! 🎯',
    `A new job at ${companyName} matches your profile. Apply now!`,
    'job_match',
    { jobId, companyName }
  );
};

export const notifyApplicationUpdate = async (userId: string, jobTitle: string, status: string) => {
  await createNotification(
    userId,
    `Application ${status}`,
    `Your application for ${jobTitle} has been ${status}`,
    'application_update',
    { status }
  );
};

export const notifyInterview = async (userId: string, companyName: string, interviewDate: Date) => {
  await createNotification(
    userId,
    'Interview Scheduled! 📅',
    `You have an interview with ${companyName} on ${interviewDate.toLocaleDateString()}`,
    'interview',
    { companyName, interviewDate }
  );
};

// Call these functions when relevant actions happen in your app
// For example, when a new job is posted that matches a user's profile