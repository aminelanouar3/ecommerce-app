// prisma/seedDeleteAllProducts.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`Deleted ${deletedProducts.count} products from the database.`);
  } catch (error) {
    console.error("Error deleting all products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
