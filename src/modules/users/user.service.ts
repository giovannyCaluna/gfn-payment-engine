import prisma from 'lib/prisma';
import { UserInfoDTO } from './DTOs/user.dto';
import { CreateUserExternalPlatformInterface } from './DTOs/create-user-external-platform.dto';
import { PaymentDTO } from '../payments/DTOs/payment.dto';

export const createLocalUser = async (mercadoPagoCustomer: any,
  paymentData: PaymentDTO) => {
  const userData: UserInfoDTO = {
    email: paymentData.userInfo.email,
    first_name: mercadoPagoCustomer.first_name,
    last_name: mercadoPagoCustomer.last_name,
    phone: mercadoPagoCustomer.phone || paymentData.userInfo.phone,
    country_code: 'CL',
  };

  const userCreated = await createUser(userData);

  // Crear relación de usuario externo
  if (userCreated && 'id' in userCreated) {

    const externalUserData: CreateUserExternalPlatformInterface = {
      user_id: userCreated.id,
      platform_id: 1,
      external_user_id: mercadoPagoCustomer.id,
      platform_name: paymentData.method,
      created_at: new Date()
    };

    await createUserExternalPlatform(externalUserData);
  }

  return userCreated;
}


export const createUser = async (data: UserInfoDTO) => {
  try {
    const newUser = await prisma.users.create({
      data: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,

        phone: data.phone?.number,
        country_code: data.country_code,
        is_active: true,
        created_at: new Date(),
      },
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return { message: 'Error al crear usuario local en plataforma' };
  }
};


export const createUserExternalPlatform = async (dto: CreateUserExternalPlatformInterface) => {
  try {
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
  } catch (error) {
    console.error(error);
    return { message: 'Error al guardar usuario de plataforma referencial ' };
  }
}