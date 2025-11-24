// prisma/seedDeleteUserById.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Change this ID to the user you want to delete
const userIdToDelete = 12;

async function main() {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userIdToDelete },
    });
    console.log("Deleted user:", deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
