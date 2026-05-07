import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  contractType: 'Full time' | 'Part time' | 'Fractional' | 'Contract';
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedBy: mongoose.Types.ObjectId;
  postedDate: Date;
  applicationsCount: number;
  isActive: boolean;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String },
    location: { type: String, required: true },
    contractType: {
      type: String,
      enum: ['Full time', 'Part time', 'Fractional', 'Contract'],
      required: true,
    },
    salary: { type: String },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postedDate: { type: Date, default: Date.now },
    applicationsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>('Job', jobSchema);