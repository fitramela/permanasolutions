import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
});
import mariadb from 'mariadb';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL tidak ditemukan di .env');
  process.exit(1);
}

const url = new URL(databaseUrl);

const pool = mariadb.createPool({
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: true,
  connectionLimit: 5,
});

async function main() {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query('SELECT 1 AS connected');

    console.log('✅ Database connection OK');
    console.log('Result:', rows);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exitCode = 1;
  } finally {
    if (conn) {
      await conn.end();
    }

    await pool.end();
  }
}

main();