import { Router } from 'express';
import { searchJobs, getRecommendedJobs, getJobById, createJob } from '../controllers/jobController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/search', searchJobs);
router.get('/recommended', protect, getRecommendedJobs);
router.get('/:id', getJobById);
router.post('/', protect, createJob);

export default router;