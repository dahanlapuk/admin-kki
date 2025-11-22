import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', (req, res) => res.json({ success: true, message: 'Search archives' }));
router.get('/:id', (req, res) => res.json({ success: true, message: 'Get archive detail' }));
router.post('/', (req, res) => res.json({ success: true, message: 'Archive content' }));
router.get('/stats/summary', (req, res) => res.json({ success: true, message: 'Get archive stats' }));
router.get('/download/:id', (req, res) => res.json({ success: true, message: 'Download file' }));

module.exports = router;
