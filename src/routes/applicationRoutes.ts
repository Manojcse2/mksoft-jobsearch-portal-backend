import { Router } from 'express';
import { applyForJob, getMyApplications } from '../controllers/applicationController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/apply/:jobId', protect, applyForJob);
router.get('/my-applications', protect, getMyApplications);

export default router;