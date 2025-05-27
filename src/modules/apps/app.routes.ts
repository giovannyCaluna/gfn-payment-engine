import { Router } from 'express';
import * as appController from './app.controller';

const router = Router();

router.post('/create', appController.create);
router.get('/', appController.list);
router.put('/:id', appController.update);
router.delete('/:id', appController.remove);

export default router;
