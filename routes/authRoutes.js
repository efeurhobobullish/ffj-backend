import express from 'express';
import passport from 'passport';
import { signup, login, createRiderByAdmin } from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback endpoint -> redirect to frontend with token
router.get('/google/callback',
  passport.authenticate('google', { session: true, failureRedirect: `${process.env.FRONTEND_URL}/auth` }),
  (req, res) => {
    // generate token and redirect to frontend with token param
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// admin creates rider
router.post('/rider', requireAuth, requireRole('admin'), createRiderByAdmin);

export default router;
