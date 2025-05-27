import { PrismaClient } from '@prisma/client';
import { CreatePaymentPlatformDTO } from './DTOs/create-platform.dto';

const prisma = new PrismaClient();

export const createPaymentPlatform = async (data: CreatePaymentPlatformDTO) => {
    return prisma.payment_platforms.create({ data });
};

export const getAllPlatforms = async () => prisma.payment_platforms.findMany();

export const getPlatformById = async (id: number) =>
  prisma.payment_platforms.findUnique({ where: { id } });

export const updatePlatformId = async (id: number, data: { name?: string; description?: string; status?: boolean }) =>
  prisma.payment_platforms.update({ where: { id }, data });

export const deletePlatformId = async (id: number) =>
  prisma.payment_platforms.delete({ where: { id } });



