import mongoose from 'mongoose';

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_match' | 'application_update' | 'interview' | 'system' | 'recommendation';
  read: boolean;
  metadata?: {
    jobId?: string;
    applicationId?: string;
    companyName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['job_match', 'application_update', 'interview', 'system', 'recommendation'],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  metadata: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    companyName: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model<INotification>('Notification', notificationSchema);