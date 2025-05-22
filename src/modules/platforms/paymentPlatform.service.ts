// src/modules/paymentPlatforms/paymentPlatform.service.ts
import * as PlatformModel from './paymentPlatform.model';
import prisma from 'lib/prisma';
import { Request, Response } from 'express';

export const listPlatforms = PlatformModel.getAllPlatforms;
export const findPlatform = PlatformModel.getPlatformById;
export const addPlatform = PlatformModel.createPlatform;
export const editPlatform = PlatformModel.updatePlatform;
export const removePlatform = PlatformModel.deletePlatform;
export const findPlatformsByCountry = PlatformModel.getPlatformsByCountry;


export const getAllPlatforms = async (req: Request, res: Response) => {
  try {
    const platforms = await prisma.payment_platforms.findMany();
    const serializedPlatforms = platforms.map(platform => ({
      ...platform,
      id: platform.id.toString(),
    }));
    res.json(serializedPlatforms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching platforms' });
  }
};