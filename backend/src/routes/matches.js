import { Router } from 'express';
import { listMecevi, getMec, createMec, recordResult, deleteMec } from '../controllers/matchController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listMecevi);
router.get('/:id', getMec);
router.post('/', authenticate, requireAdmin, createMec);
router.put('/:id/rezultat', authenticate, requireAdmin, recordResult);
router.delete('/:id', authenticate, requireAdmin, deleteMec);

export default router;
