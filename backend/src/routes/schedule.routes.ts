import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', (req, res) => res.json({ success: true, message: 'Get all schedules' }));
router.get('/:id', (req, res) => res.json({ success: true, message: 'Get schedule detail' }));
router.post('/', (req, res) => res.json({ success: true, message: 'Create schedule' }));
router.put('/:id', (req, res) => res.json({ success: true, message: 'Update schedule' }));
router.delete('/:id', authorize('admin', 'superadmin'), (req, res) =>
  res.json({ success: true, message: 'Delete schedule' })
);
router.patch('/:id/publish', (req, res) => res.json({ success: true, message: 'Publish manually' }));
router.get('/upcoming/list', (req, res) => res.json({ success: true, message: 'Get upcoming' }));

module.exports = router;
