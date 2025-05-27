import { PrismaClient } from '@prisma/client';
import { CreateAppDTO } from './DTOs/create.app.dto';
const prisma = new PrismaClient();

export const createApp = async (data:CreateAppDTO) =>
  prisma.registered_apps.create({ data });

export const getAllApps = async () => prisma.registered_apps.findMany();

export const getAppById = async (id: number) =>
  prisma.registered_apps.findUnique({ where: { id } });

export const updateApp = async (id: number, data: { name?: string; description?: string; status?: boolean }) =>
  prisma.registered_apps.update({ where: { id }, data });

export const deleteApp = async (id: number) =>
  prisma.registered_apps.delete({ where: { id } });
