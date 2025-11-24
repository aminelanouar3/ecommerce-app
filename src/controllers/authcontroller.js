import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Inscription
export const signup = async (req, res) => {
  const { name, email, password, isAdmin } = req.body; // get isAdmin from request

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin === true || isAdmin === "true" ? true : false, // only true if explicitly true
      },
    });

    res.status(201).json({ message: "User created", userId: user.id, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Connexion
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Logged in", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
    