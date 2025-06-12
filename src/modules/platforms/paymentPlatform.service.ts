import * as PlatformModel from './paymentPlatform.model';
import prisma from 'lib/prisma';
import { Request, Response } from 'express';


export const addPlatform = PlatformModel.createPaymentPlatform;
export const editPlatform = PlatformModel.updatePlatformId;
export const removePlatform = PlatformModel.deletePlatformId;
export const findPlatformsByCountry = PlatformModel.getPlatformById;


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

export const getAvailablePlatformsByCountry = async (countryCode: string) => {
  const platforms = await prisma.payment_platforms.findMany({
    where: {
      status: true,
      app_platform_credentials: {
        some: {
          country_code: countryCode
        }
      }
    },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      website_url: true,
      logo_url: true
    }
  });

  return platforms;
};