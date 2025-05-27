import { PrismaClient } from '@prisma/client';
import { CreateAppPlatformCredentialsDTO } from '@/modules/credentials/DTOs/create-platform-credentials.dto';
const prisma = new PrismaClient();

export const createCredentials = async (data:CreateAppPlatformCredentialsDTO) =>
  prisma.app_platform_credentials.create({ data });

export const getAllCredentials = async () => prisma.app_platform_credentials.findMany();

export const getCredentialsById = async (id: number) =>
  prisma.app_platform_credentials.findUnique({ where: { id } });

export const updateCredentials = async (id: number, data: { name?: string; description?: string; status?: boolean }) =>
  prisma.app_platform_credentials.update({ where: { id }, data });

export const deleteCredentials = async (id: number) =>
  prisma.app_platform_credentials.delete({ where: { id } });
