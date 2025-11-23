// scripts/getAllUsers.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany(); // fetch all users
    console.log("All users:");
    console.table(users); // nicely formats the output
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
