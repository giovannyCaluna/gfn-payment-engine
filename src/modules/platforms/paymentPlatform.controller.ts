import * as PlatformService from './paymentPlatform.service';
import { Router, Request, Response } from 'express';

import { getAllPlatforms } from '@/modules/platforms/paymentPlatform.service';





const router = Router();

router.get('/', getAllPlatforms);

router.post('/', async (req, res) => {
  const result = await PlatformService.addPlatform(req.body);
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const result = await PlatformService.editPlatform(req.params.id, req.body);
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const result = await PlatformService.removePlatform(Number(req.params.id));
  res.json(result);
});

router.get('/country/:code', async (req:any, res:any) => {
  const { code } = req.params;
  const platforms = await PlatformService.findPlatformsByCountry(code);

  if (!platforms || (Array.isArray(platforms) && platforms.length === 0)) {
    return res.status(404).send(`No platforms found for country: ${code}`);
  }

  res.json(platforms);
});




export default router;
