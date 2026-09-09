import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { prisma } from '../src/prisma.js';

async function main() {
  const adminEmail = 'putusutha30@gmail.com';

  const existing = await prisma.users.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!existing) {
    const secret = speakeasy.generateSecret({
      length: 20,
    });

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

    console.log('Admin user seeded');
  } else {
    console.log('Admin already exists');
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });