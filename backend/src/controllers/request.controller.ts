import { Response, NextFunction } from 'express';
import { ContentRequest } from '../models/ContentRequest';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all content requests
// @route   GET /api/requests
// @access  Private
export const getAllRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      status,
      priority,
      contentType,
      page = 1,
      limit = 10,
      search,
    } = req.query;

    // Build query
    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (contentType) query.contentType = contentType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const requests = await ContentRequest.find(query)
      .populate('requestedBy', 'name email')
      .populate('validatedBy', 'name email')
      .populate('assignedTo.copywriter', 'name email kki.division')
      .populate('assignedTo.designer', 'name email kki.division')
      .populate('assignedTo.videographer', 'name email kki.division')
      .populate('assignedTo.publisher', 'name email kki.division')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await ContentRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        requests,
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

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
export const getRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const request = await ContentRequest.findById(req.params.id)
      .populate('requestedBy', 'name email university komisariat')
      .populate('validatedBy', 'name email')
      .populate('assignedTo.copywriter', 'name email kki.division')
      .populate('assignedTo.designer', 'name email kki.division')
      .populate('assignedTo.videographer', 'name email kki.division')
      .populate('assignedTo.publisher', 'name email kki.division');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const requestData = {
      ...req.body,
      requestedBy: req.user.id,
      requestedAt: new Date(),
    };

    const request = await ContentRequest.create(requestData);

    // Notify admins about new request
    const adminUsers = await req.app.locals.User.find({
      role: { $in: ['admin', 'superadmin'] },
      isActive: true,
    });

    const notifications = adminUsers.map((admin: any) => ({
      userId: admin._id,
      type: 'new_request',
      title: 'Request Baru',
      message: `Request baru "${request.title}" telah dibuat`,
      relatedTo: {
        model: 'ContentRequest',
        id: request._id,
      },
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      data: request,
      message: 'Request created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
export const updateRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const request = await ContentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Check permission
    const isOwner = request.requestedBy.toString() === req.user.id;
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request',
      });
    }

    const updatedRequest = await ContentRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Request updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Admin only)
export const deleteRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const request = await ContentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate request
// @route   PATCH /api/requests/:id/validate
// @access  Private (Admin only)
export const validateRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const request = await ContentRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.status = 'validated';
    request.validatedBy = req.user.id;
    request.validatedAt = new Date();
    await request.save();

    // Notify requester
    await Notification.create({
      userId: request.requestedBy,
      type: 'approved',
      title: 'Request Divalidasi',
      message: `Request "${request.title}" telah divalidasi`,
      relatedTo: {
        model: 'ContentRequest',
        id: request._id,
      },
    });

    res.json({
      success: true,
      data: request,
      message: 'Request validated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign request to team
// @route   PATCH /api/requests/:id/assign
// @access  Private (Admin only)
export const assignRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { assignedTo } = req.body;

    const request = await ContentRequest.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo,
        status: 'assigned',
      },
      { new: true }
    ).populate('assignedTo.copywriter assignedTo.designer assignedTo.videographer assignedTo.publisher');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Notify assigned users
    const assignedUserIds = Object.values(assignedTo).filter(Boolean);
    const notifications = assignedUserIds.map((userId: any) => ({
      userId,
      type: 'assigned',
      title: 'Tugas Baru',
      message: `Anda ditugaskan untuk request "${request.title}"`,
      relatedTo: {
        model: 'ContentRequest',
        id: request._id,
      },
    }));

    await Notification.insertMany(notifications);

    res.json({
      success: true,
      data: request,
      message: 'Request assigned successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private
export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    const request = await ContentRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    res.json({
      success: true,
      data: request,
      message: 'Status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get request statistics
// @route   GET /api/requests/stats/summary
// @access  Private
export const getStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await ContentRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await ContentRequest.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const contentTypeStats = await ContentRequest.aggregate([
      {
        $group: {
          _id: '$contentType',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await ContentRequest.countDocuments();
    const pending = await ContentRequest.countDocuments({ status: 'pending' });
    const inProgress = await ContentRequest.countDocuments({
      status: { $in: ['assigned', 'in-progress', 'review'] },
    });
    const completed = await ContentRequest.countDocuments({
      status: { $in: ['approved', 'scheduled', 'published'] },
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
        byStatus: stats,
        byPriority: priorityStats,
        byContentType: contentTypeStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
