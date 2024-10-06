// src/controllers/admin/admin.ts

import { RequestHandler } from "express";
import User from "#/models/user";
import Role from "#/models/roles";
import emailVerificationToken from "#/models/emailVerificationToken";
import { generateToken, sendVerificationMail } from "#/utils/mail";
import { CreateUser } from "#/@types/user";


export const createUser: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, userName, role: roleName } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Check if the specified role exists
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    // Create a new user with the specified role
    const user = await User.create({ userName, email, password, role: role._id });

    // Send verification email
    const token = generateToken();
    await emailVerificationToken.create({
      owner: user._id,
      token,
    });

    sendVerificationMail(token, {
      userName,
      email,
      userId: user._id.toString(),
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
