import { Router } from 'express';

import { mcpHandler } from '../handlers/http.js';

const router: Router = Router();

router.all('/mcp', mcpHandler);

export default router;
