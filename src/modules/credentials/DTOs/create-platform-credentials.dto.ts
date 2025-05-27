export interface CreateAppPlatformCredentialsDTO {
  app_id: number;
  platform_id: number;
  country_code: string;
  access_token: string;
  refresh_token?: string;
  client_id?: string;
  client_secret?: string;
  public_key?: string;
  private_key?: string;
  extra_info?: string;
  status?: boolean;
}
