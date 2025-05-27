import { Router } from 'express';
import * as credentials from './credentials.controller';

const router = Router();

router.post('/create', credentials.create);
router.get('/', credentials.list);
router.post('/get', credentials.retrieve); // Ensure credentials.get is a function, not an object
router.put('/:id', credentials.update);
router.delete('/:id', credentials.remove);

export default router;
