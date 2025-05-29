import { Router } from 'express';

import { check } from '../handlers/health.js';

const router: Router = Router();

router.get('/health', check);

export default router;
