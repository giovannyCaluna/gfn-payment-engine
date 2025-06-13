
import prisma from 'lib/prisma';
import { Request, Response } from 'express';
import { CreateSubscriptionDto } from './DTO/create-subscription.dto';
import { productSubscriptionInfo } from './DTO/product-subscription-info.dto';



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
      status: dto.status ?? 'paused',
      start_date: dto.start_date,
      end_date: dto.start_date,
      next_billing_date: dto.next_billing_date,
      interval: dto.interval,
      amount: dto.amount,
      grace_period_days: dto.grace_period_days ?? 0,
      last_payment_id: dto.last_payment_id ?? null,
    },
  });

  return subscription;
}




export const obtainSuscriptionPlan = async (dto: productSubscriptionInfo) => {
  console.log(dto);

  const selectedPlan = await prisma.plans.findUnique({
    where: {
      external_id: dto.external_id,
    }
  });

  return selectedPlan;
}