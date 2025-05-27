
export interface CreatePaymentPlatformDTO {
  name: string;
  code: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  status?: boolean; // Defaults to true
}
