import { Router } from 'express';
import { priorityController } from '../controllers/priority.controller';

const router = Router();

// Mount the priority endpoint
router.get('/api/v1/priority', priorityController);

export default router;
