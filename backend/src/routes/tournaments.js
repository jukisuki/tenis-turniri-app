import { Router } from 'express';
import {
  listTurniri,
  getTurnir,
  createTurnir,
  updateTurnir,
  deleteTurnir,
} from '../controllers/tournamentController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listTurniri);
router.get('/:id', getTurnir);
router.post('/', authenticate, requireAdmin, createTurnir);
router.put('/:id', authenticate, requireAdmin, updateTurnir);
router.delete('/:id', authenticate, requireAdmin, deleteTurnir);

export default router;
