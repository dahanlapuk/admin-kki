import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require superadmin or admin role
router.use(protect);
router.use(authorize('superadmin', 'admin'));

router.get('/users', (req, res) => res.json({ success: true, message: 'Get all users' }));
router.post('/users', (req, res) => res.json({ success: true, message: 'Create user' }));
router.put('/users/:id', (req, res) => res.json({ success: true, message: 'Update user' }));
router.delete('/users/:id', authorize('superadmin'), (req, res) =>
  res.json({ success: true, message: 'Delete user' })
);
router.get('/analytics', (req, res) => res.json({ success: true, message: 'Get analytics' }));
router.post('/export', (req, res) => res.json({ success: true, message: 'Export report' }));

module.exports = router;
