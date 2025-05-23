import * as PlatformService from './paymentPlatform.service';
import { Router, Request, Response } from 'express';

import { getAllPlatforms } from '@/modules/platforms/paymentPlatform.service';

const router = Router();
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await getAllPlatforms(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/country/:code', async (req: any, res: any) => {
  const platforms = await PlatformService.getPlatformById(req.params.code, res);
  res.json(platforms);
});
// router.post('/', async (req, res) => {
//   const result = await PlatformService.addPlatform(req.body);
//   res.status(201).json(result);
// });

// router.put('/:id', async (req, res) => {
//   const result = await PlatformService.editPlatform(req.params.id, req.body);
//   res.json(result);
// });

// router.delete('/:id', async (req, res) => {
//   const result = await PlatformService.removePlatform(Number(req.params.id));
//   res.json(result);
// });

export default router;
