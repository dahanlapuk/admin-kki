import mongoose, { Document, Schema } from 'mongoose';

export interface IContentRequest extends Document {
  ticketId: string;
  title: string;
  contentType: 'Poster' | 'Carousel' | 'Video' | 'Caption' | 'Liputan' | 'Infografis';
  deadline: Date;
  purpose: string;
  description: string;
  keyPoints: string[];
  targetAudience: string;
  publishPlatform: string[];
  references: string[];
  notes?: string;
  status:
    | 'pending'
    | 'validated'
    | 'assigned'
    | 'in-progress'
    | 'review'
    | 'approved'
    | 'scheduled'
    | 'published'
    | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    copywriter?: mongoose.Types.ObjectId;
    designer?: mongoose.Types.ObjectId;
    videographer?: mongoose.Types.ObjectId;
    publisher?: mongoose.Types.ObjectId;
  };
  requestedBy: mongoose.Types.ObjectId;
  requestedAt: Date;
  validatedBy?: mongoose.Types.ObjectId;
  validatedAt?: Date;
}

const contentRequestSchema = new Schema<IContentRequest>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    contentType: {
      type: String,
      required: [true, 'Content type is required'],
      enum: ['Poster', 'Carousel', 'Video', 'Caption', 'Liputan', 'Infografis'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    keyPoints: [
      {
        type: String,
      },
    ],
    targetAudience: {
      type: String,
      required: [true, 'Target audience is required'],
    },
    publishPlatform: [
      {
        type: String,
      },
    ],
    references: [
      {
        type: String,
      },
    ],
    notes: String,
    status: {
      type: String,
      enum: [
        'pending',
        'validated',
        'assigned',
        'in-progress',
        'review',
        'approved',
        'scheduled',
        'published',
        'rejected',
      ],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    assignedTo: {
      copywriter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      designer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      videographer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      publisher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    validatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    validatedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate ticket ID before saving
contentRequestSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('ContentRequest').countDocuments();
    this.ticketId = `KKI-REQ-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const ContentRequest = mongoose.model<IContentRequest>('ContentRequest', contentRequestSchema);
