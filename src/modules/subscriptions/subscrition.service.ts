
import prisma from 'lib/prisma';
import { Request, Response } from 'express';
import { CreateSubscriptionDto, CreateUserExternalPlatformInterface, CreateUserInterface } from './DTO/create-subscription.dto';



export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const platforms = await prisma.subscriptions.findMany();
    res.json(platforms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching platforms' });
  }
};

export const createSubscription = async (dto: CreateSubscriptionDto) => {

  const subscription = await prisma.subscriptions.create({
    data: {
      user_id: dto.user_id,
      plan_id: dto.plan_id,
      status: dto.status ?? 'active',
      start_date: new Date(dto.start_date),
      next_billing_date: new Date(dto.next_billing_date),
      interval: dto.interval,
      grace_period_days: dto.grace_period_days ?? 0,
      last_payment_id: dto.last_payment_id ?? null,
    },
  });

  return subscription;
}

export const createUser = async (dto: CreateUserInterface) => {

  const newUser = await prisma.users.create({
    data: {
      email: dto.email,
      first_name: dto.first_name,
      last_name: dto.last_name,

      phone: dto.phone?.number,
      country_code: dto.country_code,
      is_active: dto.is_active,
      created_at: dto.created_at,
    },
  });

  return newUser;
}

export const createUserExternalPlatform = async (dto: CreateUserExternalPlatformInterface) => {

  const newUser = await prisma.user_external_identifiers.create({
    data: {
      user_id: dto.user_id,
      platform_id: dto.platform_id,
      external_user_id: dto.external_user_id || "test",
      platform_name: dto.platform_name,
      created_at: dto.created_at,
    },
  });

  return newUser;
}