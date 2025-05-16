import UserIntegrationService from './user.integration';
import { UserDTO } from './user.dto';


type platform = 'mercadopago' | 'wom' | 'stripe';
class UserService {

  private userIntegrationService: UserIntegrationService;

  constructor() {
    this.userIntegrationService = new UserIntegrationService();
  }
  // Crear un usuario
  async createUser(userDTO: UserDTO): Promise<any> {
    const { platform } = userDTO;
    return await this.userIntegrationService.createUser(userDTO, platform as platform);
  }
}

export default UserService;
