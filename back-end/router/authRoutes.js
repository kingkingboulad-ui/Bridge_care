import express from "express";

import {
  register,
  login,
  logout, 
  googleLogin,
  adminLogin,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();
router.post("/admin/login", adminLogin);

/**
 * Register
 *
 * Supports:
 * - Patient registration
 * - Nurse registration + files
 */
router.post(
  "/register",
  upload.fields([
    {
      name: "license",
      maxCount: 1,
    },
    {
      name: "cv",
      maxCount: 1,
    },
  ]),
  register
);

/**
 * Login
 */
router.post("/login", login);

/**
 * Current logged-in user
 */
router.get("/me", protect, async (req, res) => {
  res.json({
    user: req.user,
  });
});

/**
 * Logout
 */
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post("/logout", logout);
router.post("/google", googleLogin);
export default router;