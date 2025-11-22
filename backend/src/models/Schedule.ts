import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
  contentId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  scheduledTime: string;
  platform: string[];
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  publishedAt?: Date;
  publishedBy?: mongoose.Types.ObjectId;
  postUrl?: string;
  notes?: string;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      required: true,
    },
    platform: [
      {
        type: String,
        enum: ['Instagram', 'Twitter', 'Website', 'Facebook'],
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'published', 'failed', 'cancelled'],
      default: 'scheduled',
    },
    publishedAt: Date,
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    postUrl: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);
