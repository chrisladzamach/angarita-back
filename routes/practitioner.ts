import { Router } from 'express';
import { getAllPractitioners, getPractitioner, createPractitioner, updatePractitioner, deletePractitioner} from '../controllers/PractitionerController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getAllPractitioners);
router.get('/:id', authMiddleware, getPractitioner);
router.post('/', authMiddleware, createPractitioner);
router.put('/:id', authMiddleware, updatePractitioner);
router.delete('/:id', authMiddleware, deletePractitioner)

export default router;
