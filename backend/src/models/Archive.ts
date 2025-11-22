import mongoose, { Document, Schema } from 'mongoose';

export interface IArchive extends Document {
  contentId: mongoose.Types.ObjectId;
  requestId: mongoose.Types.ObjectId;
  tags: string[];
  category: string;
  year: number;
  month: number;
  isPublic: boolean;
  downloadCount: number;
  archivedAt: Date;
  archivedBy: mongoose.Types.ObjectId;
}

const archiveSchema = new Schema<IArchive>(
  {
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: 'ContentRequest',
      required: true,
    },
    tags: [String],
    category: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    archivedAt: {
      type: Date,
      default: Date.now,
    },
    archivedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for search optimization
archiveSchema.index({ tags: 1, category: 1, year: 1, month: 1 });

export const Archive = mongoose.model<IArchive>('Archive', archiveSchema);
