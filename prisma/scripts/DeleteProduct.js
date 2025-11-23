// prisma/seedDeleteProduct.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const productId = 1; // Replace with the ID of the product you want to delete

  const deletedProduct = await prisma.product.delete({
    where: { id: productId },
  });

  console.log("Product deleted:", deletedProduct);
}

main()
  .catch((e) => {
    console.error("Error deleting product:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
