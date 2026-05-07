import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'candidate' | 'employer';
  companyName?: string;
  website?: string;
  currentJobTitle?: string;
  workExperience?: string;
  professionalSummary?: string;
  personalityCompleted?: boolean;
  profileVisible?: boolean;
  receiveNotifications?: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['candidate', 'employer'], default: 'candidate' },
    companyName: { type: String },
    website: { type: String },
    currentJobTitle: { type: String },
    workExperience: { type: String },
    professionalSummary: { type: String },
    personalityCompleted: { type: Boolean, default: false },
    profileVisible: { type: Boolean, default: true },
    receiveNotifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);