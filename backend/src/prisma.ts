import dotenv from 'dotenv';
import path from 'path';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

// Load .env dari root proyek (dua folder di atas backend/src)
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL tidak ditemukan');

const url = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  ssl: true,
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });