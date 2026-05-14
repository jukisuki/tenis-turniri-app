import { Router } from 'express';
import { listIgraci, getIgrac, updateIgrac, deleteIgrac } from '../controllers/playerController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listIgraci);
router.get('/:id', getIgrac);
router.put('/:id', authenticate, updateIgrac);
router.delete('/:id', authenticate, requireAdmin, deleteIgrac);

export default router;
