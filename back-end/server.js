import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import DBConnection from "./config/DBConnect.js";

import authRoutes from "./router/authRoutes.js";
import nurseRoutes from "./router/nurseRoutes.js";
import patientRoutes from "./router/patientRoutes.js";
import dashboardRoutes from "./router/dashboardRoutes.js";
import bookingRoutes from "./router/bookingRoutes.js";
import aiCareRoutes from "./router/aiCareRoutes.js";
import adminRoutes from "./router/adminRoutes.js";
import nurseSearchRoutes from "./router/nurseSearchRoutes.js";

// NEW: Contact
import contactRoutes from './router/contactRoutes.js';


dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Static uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/nurses/search", nurseSearchRoutes);
app.use("/api/nurses", nurseRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api/ai", aiCareRoutes);
app.use("/api/admin", adminRoutes);

// NEW: Contact Us
app.use('/api/contact', contactRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});