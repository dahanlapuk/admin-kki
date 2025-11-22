import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import {
  getAllContents,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  uploadFiles,
  submitForReview,
  approveContent,
  rejectContent,
  getVersionHistory,
} from '../controllers/content.controller';

const router = Router();

router.use(protect);

// Version history must be before :id routes
router.get('/:id/versions', getVersionHistory);

// CRUD routes
router.route('/').get(getAllContents).post(createContent);

router.route('/:id').get(getContent).put(updateContent).delete(authorize('admin', 'superadmin'), deleteContent);

// File upload
router.post('/:id/upload', upload.array('files', 10), uploadFiles);

// Workflow routes
router.patch('/:id/review', submitForReview);
router.patch('/:id/approve', authorize('admin', 'superadmin'), approveContent);
router.patch('/:id/reject', authorize('admin', 'superadmin'), rejectContent);

module.exports = router;
