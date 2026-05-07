import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedJob extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  savedAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

savedJobSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJob>('SavedJob', savedJobSchema);