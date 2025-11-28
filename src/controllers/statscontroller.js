import { prisma } from "../prisma.js";

// GET total sales
export const getTotalSales = async (req, res) => {
  try {
    const result = await prisma.order.aggregate({
      _sum: { total: true },
    });

    return res.json({ totalSales: result._sum.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET total number of orders
export const getOrderCount = async (req, res) => {
  try {
    const count = await prisma.order.count();
    return res.json({ totalOrders: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET top 5 popular products
export const getPopularProducts = async (req, res) => {
  try {
    const popular = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5, // top 5 products
    });

    // Add product details
    const result = await Promise.all(
      popular.map(async item => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          product,
          totalQuantitySold: item._sum.quantity,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optional: combined stats for dashboard
export const getAllStats = async (req, res) => {
  try {
    const [totalSales, totalOrders, popularProducts] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count(),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      })
    ]);

    const popular = await Promise.all(
      popularProducts.map(async item => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          product,
          totalQuantitySold: item._sum.quantity,
        };
      })
    );

    res.json({
      totalSales: totalSales._sum.total || 0,
      totalOrders,
      popularProducts: popular,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
