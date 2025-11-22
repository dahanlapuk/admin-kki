import { Response, NextFunction } from 'express';
import { Content } from '../models/Content';
import { ContentRequest } from '../models/ContentRequest';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

// @desc    Get all contents
// @route   GET /api/contents
// @access  Private
export const getAllContents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, contentType, page = 1, limit = 10, search } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (contentType) query.contentType = contentType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caption: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const contents = await Content.find(query)
      .populate('requestId', 'ticketId title deadline')
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Content.countDocuments(query);

    res.json({
      success: true,
      data: {
        contents,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single content
// @route   GET /api/contents/:id
// @access  Private
export const getContent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('requestId')
      .populate('reviewedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('revisions.revisedBy', 'name email');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new content
// @route   POST /api/contents
// @access  Private
export const createContent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { requestId, ...contentData } = req.body;

    // Verify request exists
    const request = await ContentRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Content request not found',
      });
    }

    const content = await Content.create({
      requestId,
      ...contentData,
    });

    // Update request status
    request.status = 'in-progress';
    await request.save();

    res.status(201).json({
      success: true,
      data: content,
      message: 'Content created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update content
// @route   PUT /api/contents/:id
// @access  Private
export const updateContent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    // Add to revision history if content is being modified
    if (req.body.caption || req.body.files) {
      content.revisions.push({
        version: content.version,
        changes: req.body.revisionNotes || 'Content updated',
        revisedBy: req.user.id,
        revisedAt: new Date(),
      });
      content.version += 1;
    }

    Object.assign(content, req.body);
    await content.save();

    res.json({
      success: true,
      data: content,
      message: 'Content updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete content
// @route   DELETE /api/contents/:id
// @access  Private (Admin only)
export const deleteContent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    // Delete associated files
    content.files.forEach((file) => {
      const filePath = path.join(process.cwd(), file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await content.deleteOne();

    res.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload files to content
// @route   POST /api/contents/:id/upload
// @access  Private
export const uploadFiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    if (!req.files || (req.files as any).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const files = (req.files as Express.Multer.File[]).map((file) => ({
      filename: file.filename,
      path: file.path,
      type: (file.mimetype.startsWith('image/')
        ? 'image'
        : file.mimetype.startsWith('video/')
          ? 'video'
          : file.mimetype.includes('pdf') || file.mimetype.includes('photoshop')
            ? 'design'
            : 'document') as 'image' | 'video' | 'design' | 'document',
      size: file.size,
      uploadedAt: new Date(),
    }));

    content.files.push(...files);
    await content.save();

    res.json({
      success: true,
      data: content,
      message: 'Files uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit content for review
// @route   PATCH /api/contents/:id/review
// @access  Private
export const submitForReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const content = await Content.findById(req.params.id).populate('requestId');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    content.status = 'review';
    await content.save();

    // Update request status
    const request = await ContentRequest.findById(content.requestId);
    if (request) {
      request.status = 'review';
      await request.save();

      // Notify admins
      const adminUsers = await req.app.locals.User.find({
        role: { $in: ['admin', 'superadmin'] },
        isActive: true,
      });

      const notifications = adminUsers.map((admin: any) => ({
        userId: admin._id,
        type: 'review_needed',
        title: 'Konten Perlu Review',
        message: `Konten "${content.title}" siap untuk direview`,
        relatedTo: {
          model: 'Content',
          id: content._id,
        },
      }));

      await Notification.insertMany(notifications);
    }

    res.json({
      success: true,
      data: content,
      message: 'Content submitted for review',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve content
// @route   PATCH /api/contents/:id/approve
// @access  Private (Admin only)
export const approveContent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reviewNotes } = req.body;

    const content = await Content.findById(req.params.id).populate('requestId');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    content.status = 'approved';
    content.reviewedBy = req.user.id;
    content.approvedBy = req.user.id;
    content.approvedAt = new Date();
    content.reviewNotes = reviewNotes;
    await content.save();

    // Update request status
    const request = await ContentRequest.findById(content.requestId);
    if (request) {
      request.status = 'approved';
      await request.save();

      // Notify requester
      await Notification.create({
        userId: request.requestedBy,
        type: 'approved',
        title: 'Konten Disetujui',
        message: `Konten "${content.title}" telah disetujui`,
        relatedTo: {
          model: 'Content',
          id: content._id,
        },
      });
    }

    res.json({
      success: true,
      data: content,
      message: 'Content approved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject content
// @route   PATCH /api/contents/:id/reject
// @access  Private (Admin only)
export const rejectContent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { reviewNotes } = req.body;

    const content = await Content.findById(req.params.id).populate('requestId');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    content.status = 'rejected';
    content.reviewedBy = req.user.id;
    content.reviewNotes = reviewNotes;
    await content.save();

    // Update request status
    const request = await ContentRequest.findById(content.requestId);
    if (request) {
      request.status = 'rejected';
      await request.save();

      // Notify assigned users
      const assignedUserIds = Object.values(request.assignedTo || {}).filter(Boolean);
      const notifications = assignedUserIds.map((userId: any) => ({
        userId,
        type: 'rejected',
        title: 'Konten Perlu Revisi',
        message: `Konten "${content.title}" memerlukan revisi: ${reviewNotes}`,
        relatedTo: {
          model: 'Content',
          id: content._id,
        },
      }));

      await Notification.insertMany(notifications);
    }

    res.json({
      success: true,
      data: content,
      message: 'Content rejected, revision required',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get version history
// @route   GET /api/contents/:id/versions
// @access  Private
export const getVersionHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const content = await Content.findById(req.params.id)
      .select('title version revisions')
      .populate('revisions.revisedBy', 'name email');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    res.json({
      success: true,
      data: {
        title: content.title,
        currentVersion: content.version,
        history: content.revisions,
      },
    });
  } catch (error) {
    next(error);
  }
};
