import { Router } from 'express';
import { listVijesti, getVijest, createVijest, updateVijest, deleteVijest } from '../controllers/newsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listVijesti);
router.get('/:id', getVijest);
router.post('/', authenticate, requireAdmin, createVijest);
router.put('/:id', authenticate, requireAdmin, updateVijest);
router.delete('/:id', authenticate, requireAdmin, deleteVijest);

export default router;
