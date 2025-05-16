export interface UserDTO {
  id: string;
  platform: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone:string;
  identification: {
    type: string;
    number: string;
  };
}
