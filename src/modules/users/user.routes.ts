import { Router } from 'express';
import * as users from './user.controller';

const router = Router();

router.post('/create', users.create);

export default router;