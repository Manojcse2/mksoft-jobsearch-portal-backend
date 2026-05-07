import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateSetupChecklist,
  getSavedJobs,
  saveJob,
  unsaveJob,
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/setup-checklist', protect, updateSetupChecklist);
router.get('/saved-jobs', protect, getSavedJobs);
router.post('/save-job/:jobId', protect, saveJob);
router.delete('/unsave-job/:jobId', protect, unsaveJob);

export default router;