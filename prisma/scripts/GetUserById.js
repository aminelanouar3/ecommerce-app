// prisma/seedGetUserById.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Change this ID to the user you want to fetch
const userIdToGet = 1;

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userIdToGet },
    });

    if (user) {
      console.log("User found:", user);
    } else {
      console.log(`User with ID ${userIdToGet} not found.`);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
