import { executeQuery } from '@/utils/query';

export async function getAllPlatforms() {
    return await executeQuery('SELECT * FROM payment_platforms');
}

export async function getPlatformById(id: number) {
    return await executeQuery('SELECT * FROM payment_platforms WHERE id = ?', [id]);
}

export async function createPlatform(data: {
    name: string;
    description?: string;
    website_url?: string;
    logo_url?: string;
    status?: boolean;
    country_available?: string;
}) {
    const { name, description, website_url, logo_url, status = true, country_available } = data;

    return await executeQuery(
        `INSERT INTO payment_platforms 
      (name, description, website_url, logo_url, status, country_available) 
     VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, website_url, logo_url, status, country_available]
    );
}

export async function updatePlatform(id: string, data: Partial<{
    name: string;
    description: string;
    website_url: string;
    logo_url: string;
    status: boolean;
    country_available: string;
}>) {
    const fields = Object.entries(data)
        .map(([key, _], idx) => `${key} = ?`)
        .join(', ');

    const values = Object.values(data);
    values.push(id);

    return await executeQuery(
        `UPDATE payment_platforms SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
    );
}

export async function deletePlatform(id: number) {
    return await executeQuery('DELETE FROM payment_platforms WHERE id = ?', [id]);
}


export async function getPlatformsByCountry(country: string) {
  return await executeQuery(
    'SELECT * FROM payment_platforms WHERE country_available = ?',
    [country]
  );
}
