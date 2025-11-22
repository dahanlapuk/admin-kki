import { Router } from 'express';
import { login, logout, getMe, refreshToken, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
