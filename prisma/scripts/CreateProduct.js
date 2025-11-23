// prisma/seedCreateProduct.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a single product
  const product = await prisma.product.create({
    data: {
      name: "New Product",
      description: "This is a sample product",
      price: 120,
      stock: 20,
    },
  });

  console.log("Product created:", product);
}

main()
  .catch((e) => {
    console.error("Error creating product:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
