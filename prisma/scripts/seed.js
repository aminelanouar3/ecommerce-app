// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin user already exists:", existingAdmin.email);
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10); // change password if you want

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log("Admin user created:", adminUser.email);
}

main()
  .catch((e) => {
    console.error("Error creating admin:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
