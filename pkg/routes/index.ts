import { Router } from 'express';

import healthRoutes from './health.js';
import mcpRoutes from './mcp.js';

export const router: Router = Router();

router.use(healthRoutes);
router.use(mcpRoutes);
