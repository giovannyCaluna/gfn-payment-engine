import { Router } from 'express';
import * as subscriotions from './subscription.controller';

const router = Router();

router.post('/create', subscriotions.create);
router.get('/getAll', subscriotions.getAll); 

export default router;