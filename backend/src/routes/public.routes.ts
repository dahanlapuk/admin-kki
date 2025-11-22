import { Router } from 'express';

const router = Router();

// Public routes - no authentication required
router.post('/request', (req, res) => res.json({ success: true, message: 'Submit public request' }));
router.get('/request/:ticketId', (req, res) => res.json({ success: true, message: 'Check request status' }));
router.get('/portfolio', (req, res) => res.json({ success: true, message: 'Get portfolio' }));
router.get('/sop', (req, res) => res.json({ success: true, message: 'Get SOP KKI' }));

module.exports = router;
