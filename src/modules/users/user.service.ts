import prisma from 'lib/prisma';
import { UserInfoDTO } from './DTOs/user.dto';



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
    return { message: 'Error al guardar las credenciales' };
  }
};