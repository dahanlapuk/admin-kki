import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
  validateRequest,
  assignRequest,
  updateStatus,
  getStats,
} from '../controllers/request.controller';

const router = Router();

// All routes require authentication
router.use(protect);

// Stats must be before :id route
router.get('/stats/summary', getStats);

// CRUD routes
router.route('/').get(getAllRequests).post(createRequest);

router.route('/:id').get(getRequest).put(updateRequest).delete(authorize('admin', 'superadmin'), deleteRequest);

// Workflow routes
router.patch('/:id/validate', authorize('admin', 'superadmin'), validateRequest);
router.patch('/:id/assign', authorize('admin', 'superadmin'), assignRequest);
router.patch('/:id/status', updateStatus);

module.exports = router;
