import { prisma } from "../prisma.js";
import { transporter } from "../middlewares/mailer.js";
import "dotenv/config";

// POST /orders/create
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1. Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    // 2. Calculate total price
    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    // 3. Create order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: { items: { include: { product: true } } }
    });

    // 4. Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
// 5. Send email
const user = await prisma.user.findUnique({ where: { id: userId } });

try {
  // Create product list as plain text
  const productListText = order.items
    .map(
      (item) =>
        `${item.product.name} - Price: $${item.price} - Quantity: ${item.quantity}`
    )
    .join("\n");

  // Plain text content
  const textContent = `
Hi ${user.name},

Your order has been successfully placed. Here are the details:

${productListText}

Total Price: $${order.total}

Your products will be delivered within 3-6 days.

Thank you for shopping with us!
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your order has been placed!",
    text: textContent
  });
} catch (emailErr) {
  console.log("Error sending order email:", emailErr.message);
}


    // 6. Return the order
    return res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /orders/:userId
export const getOrders = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });

    return res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /orders/status/:orderId (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const { status } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: { include: { product: true } } }
    });
    return res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET /admin/orders - get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: "desc" }
    });

    return res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /admin/orders/status/:status - filter by status
export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const orders = await prisma.order.findMany({
      where: { status },
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: "desc" }
    });

    return res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /admin/orders/:orderId - optional
export const deleteOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);

    // 1. Delete OrderItem rows related to the order
    await prisma.orderItem.deleteMany({
      where: { orderId }
    });

    // 2. Delete the order itself
    await prisma.order.delete({
      where: { id: orderId }
    });

    return res.json({ message: "Order deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



