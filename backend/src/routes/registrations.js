import { Router } from 'express';
import { listPrijave, prijaviSe, odobriPrijavu, odbijPrijavu, otkaziPrijavu } from '../controllers/registrationController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, requireAdmin, listPrijave);
router.post('/', authenticate, prijaviSe);
router.put('/:id/odobri', authenticate, requireAdmin, odobriPrijavu);
router.put('/:id/odbij', authenticate, requireAdmin, odbijPrijavu);
router.delete('/:id', authenticate, otkaziPrijavu);

export default router;
