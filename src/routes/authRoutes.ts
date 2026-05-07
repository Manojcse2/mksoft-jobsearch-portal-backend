import { Router } from 'express';
import { signup, employerSignup, login } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/employer-signup', employerSignup);
router.post('/login', login);

export default router;