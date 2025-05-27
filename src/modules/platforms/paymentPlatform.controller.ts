import * as PlatformService from './paymentPlatform.service';
import { Router, Request, Response } from 'express';
import * as paymentPlatformModel from './paymentPlatform.model';
import { CreatePaymentPlatformDTO } from './DTOs/create-platform.dto';


export const create = async (req: Request, res: Response) => {
  const data:CreatePaymentPlatformDTO = req.body;
  const app = await paymentPlatformModel.createPaymentPlatform(data);
  res.status(201).json(app);
};

export const list = async (_req: Request, res: Response) => {
  const apps = await paymentPlatformModel.getAllPlatforms();
  res.json(apps);
};

export const get = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const app = await paymentPlatformModel.getPlatformById(id);
  if (!app) return res.status(404).json({ message: 'App not found' });
  res.json(app);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const app = await paymentPlatformModel.updatePlatformId(id, req.body);
  res.json(app);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await paymentPlatformModel.deletePlatformId(id);
  res.status(204).send();
};

