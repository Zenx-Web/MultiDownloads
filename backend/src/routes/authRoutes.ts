import { Router } from 'express';
import {
  signUpHandler,
  signInHandler,
  signOutHandler,
  getSessionHandler,
  resetPasswordHandler,
  updatePasswordHandler,
  getCurrentUserHandler,
} from '../controllers/authController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/signup', signUpHandler);
router.post('/signin', signInHandler);
router.post('/signout', signOutHandler);
router.post('/reset-password', resetPasswordHandler);
router.get('/session', getSessionHandler);

// Protected routes
router.get('/me', requireAuth, getCurrentUserHandler);
router.put('/password', requireAuth, updatePasswordHandler);

export default router;
