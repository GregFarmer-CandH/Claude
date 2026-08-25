import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@farmer-crossfit.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";
  const name = process.env.ADMIN_NAME ?? "Administrateur";

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Compte admin déjà existant : ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({
    data: { email, passwordHash, name },
  });

  console.log(`Compte admin créé : ${email}`);
  console.log("Pense à changer ce mot de passe après la première connexion.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
