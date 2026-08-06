// prisma/seed.ts
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client.js';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';

// Buat adapter dengan DATABASE_URL dari env
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'putusutha30@gmail.com';
  const existing = await prisma.users.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const secret = speakeasy.generateSecret({ length: 20 });
    await prisma.users.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: await bcrypt.hash('admin123', 10),
        active_status: true,
        two_fa_secret: secret.base32,
        two_fa_enabled: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    console.log('✅ Admin user seeded');
  } else {
    console.log('ℹ️ Admin already exists');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });