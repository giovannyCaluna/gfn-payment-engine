import { Request, Response } from 'express';
import * as appModel from './app.model';

export const create = async (req: Request, res: Response) => {
  const data = req.body;
  const app = await appModel.createApp(data);
  res.status(201).json(app);
};

export const list = async (_req: Request, res: Response) => {
  const apps = await appModel.getAllApps();
  res.json(apps);
};

export const get = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const app = await appModel.getAppById(id);
  if (!app) return res.status(404).json({ message: 'App not found' });
  res.json(app);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const app = await appModel.updateApp(id, req.body);
  res.json(app);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await appModel.deleteApp(id);
  res.status(204).send();
};
