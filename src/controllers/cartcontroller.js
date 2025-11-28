import { prisma } from "../prisma.js"; // adjust path if needed

// Helper: get or create cart for a user
async function getOrCreateCart(userId) {
  return await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

// GET /cart/:userId
export const getCart = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart) return res.json({ items: [], total: 0 });

    const total = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

    return res.json({ ...cart, total });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// POST /cart/add
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    // 1. Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    // 2. Check stock
    if (quantity > product.stock) return res.status(400).json({ error: "Not enough stock" });

    // 3. Get or create cart
    const cart = await getOrCreateCart(userId);

    // 4. Check if item already exists in cart
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > product.stock) return res.status(400).json({ error: "Not enough stock" });

      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });
      return res.json(updated);
    }

    // 5. Add new item
    const item = await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: { product: true }
    });

    return res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// PUT /cart/item/:id
export const updateCartItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    // Find item
    const item = await prisma.cartItem.findUnique({ where: { id }, include: { product: true } });
    if (!item) return res.status(404).json({ error: "Cart item not found" });

    // Check stock
    if (quantity > item.product.stock) return res.status(400).json({ error: "Not enough stock" });

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      return res.json({ message: "Item removed" });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true }
    });

    return res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /cart/item/:id
export const removeCartItem = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.cartItem.delete({ where: { id } });
    return res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// DELETE /cart/clear/:userId
export const clearCart = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return res.json({ message: "Cart cleared" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

