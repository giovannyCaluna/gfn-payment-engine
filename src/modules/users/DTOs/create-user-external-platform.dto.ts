export interface CreateUserExternalPlatformInterface {
  user_id: number,
  platform_id: number,
  external_user_id?: string,
  platform_name: string,
  created_at: Date;
  updated_at?: Date;
}