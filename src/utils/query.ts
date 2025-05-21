import pool from '@/config/db';

export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
}
