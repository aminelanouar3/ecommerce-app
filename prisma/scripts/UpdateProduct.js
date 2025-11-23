// prisma/seedUpdateProduct.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const productId = 1; // Replace with the ID of the product you want to update

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      name: "Updated Product Name",
      description: "Updated description for the product",
      price: 150, // new price
      stock: 30,  // new stock
    },
  });

  console.log("Product updated:", updatedProduct);
}

main()
  .catch((e) => {
    console.error("Error updating product:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
