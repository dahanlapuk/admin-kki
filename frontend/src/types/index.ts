// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'staff' | 'member';
  kki?: {
    division: 'copywriter' | 'designer' | 'videographer' | 'publisher' | 'general';
    isActive: boolean;
    permissions: string[];
  };
  university?: string;
  komisariat?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Content Request Types
export interface ContentRequest {
  _id: string;
  ticketId: string;
  title: string;
  contentType: 'Poster' | 'Carousel' | 'Video' | 'Caption' | 'Liputan' | 'Infografis';
  deadline: string;
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
    copywriter?: User;
    designer?: User;
    videographer?: User;
    publisher?: User;
  };
  requestedBy: User;
  requestedAt: string;
  validatedBy?: User;
  validatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Content Types
export interface FileUpload {
  filename: string;
  path: string;
  type: 'image' | 'video' | 'design' | 'document';
  size: number;
  uploadedAt: string;
}

export interface Revision {
  version: number;
  changes: string;
  revisedBy: User;
  revisedAt: string;
}

export interface Content {
  _id: string;
  requestId: ContentRequest;
  title: string;
  contentType: string;
  caption?: string;
  hashtags: string[];
  files: FileUpload[];
  version: number;
  revisions: Revision[];
  status: 'draft' | 'review' | 'revision' | 'approved' | 'rejected';
  reviewedBy?: User;
  reviewNotes?: string;
  approvedBy?: User;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Schedule Types
export interface Schedule {
  _id: string;
  contentId: Content;
  scheduledDate: string;
  scheduledTime: string;
  platform: ('Instagram' | 'Twitter' | 'Website' | 'Facebook')[];
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  publishedAt?: string;
  publishedBy?: User;
  postUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Archive Types
export interface Archive {
  _id: string;
  contentId: Content;
  requestId: ContentRequest;
  tags: string[];
  category: string;
  year: number;
  month: number;
  isPublic: boolean;
  downloadCount: number;
  archivedAt: string;
  archivedBy: User;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  type:
    | 'new_request'
    | 'assigned'
    | 'review_needed'
    | 'approved'
    | 'rejected'
    | 'published'
    | 'deadline_reminder';
  title: string;
  message: string;
  relatedTo: {
    model: string;
    id: string;
  };
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    requests?: T[];
    pagination: PaginationMeta;
  };
}

// Statistics Types
export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  byStatus: Array<{ _id: string; count: number }>;
  byPriority: Array<{ _id: string; count: number }>;
  byContentType: Array<{ _id: string; count: number }>;
}
