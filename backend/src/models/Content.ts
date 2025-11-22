import mongoose, { Document, Schema } from 'mongoose';

interface IFileUpload {
  filename: string;
  path: string;
  type: 'image' | 'video' | 'design' | 'document';
  size: number;
  uploadedAt: Date;
}

interface IRevision {
  version: number;
  changes: string;
  revisedBy: mongoose.Types.ObjectId;
  revisedAt: Date;
}

export interface IContent extends Document {
  requestId: mongoose.Types.ObjectId;
  title: string;
  contentType: string;
  caption?: string;
  hashtags: string[];
  files: IFileUpload[];
  version: number;
  revisions: IRevision[];
  status: 'draft' | 'review' | 'revision' | 'approved' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
}

const contentSchema = new Schema<IContent>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: 'ContentRequest',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    caption: String,
    hashtags: [String],
    files: [
      {
        filename: String,
        path: String,
        type: {
          type: String,
          enum: ['image', 'video', 'design', 'document'],
        },
        size: Number,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    version: {
      type: Number,
      default: 1,
    },
    revisions: [
      {
        version: Number,
        changes: String,
        revisedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        revisedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'review', 'revision', 'approved', 'rejected'],
      default: 'draft',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewNotes: String,
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model<IContent>('Content', contentSchema);
