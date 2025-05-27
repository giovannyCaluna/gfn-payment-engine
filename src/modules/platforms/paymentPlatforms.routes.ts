import { Router } from 'express';
import * as platformController from './paymentPlatform.controller';

const router = Router();

router.post('/create', platformController.create);
router.get('/', platformController.list);
router.put('/:id', platformController.update);
router.delete('/:id', platformController.remove);

export default router;
