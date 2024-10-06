// src/routes/admin.ts

import { Router } from "express";
import { createUser } from "#/admin/admin";
import { isAuth, hasRoles } from "#/middleware/auth"; // Ensure that only Admins can access this route

const router = Router();

// Only allow Admins to create users
router.post("/create-user", isAuth, hasRoles(['Admin']), createUser);

export default router;
