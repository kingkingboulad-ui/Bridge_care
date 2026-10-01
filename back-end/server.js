import express from "express";
import http from "http"; 
import { Server } from "socket.io"; 
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
import settingsRoutes from "./router/settings.routes.js";
import contactRoutes from "./router/contactRoutes.js";
import notificationRoutes from "./router/notificationRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT ;

const server = http.createServer(app);


export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);


  socket.on("join", ({ userId, role, nurseProfileId }) => {
    // غرفة خاصة بالمستخدم حسب ID حسابه
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room: user_${userId}`);
    }

   
    if (role === "admin") {
      socket.join("admins_room");
      console.log(`Admin joined room: admins_room`);
    }


    if (nurseProfileId) {
      socket.join(`nurse_${nurseProfileId}`);
      console.log(`Nurse ${nurseProfileId} joined room: nurse_${nurseProfileId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Middlewares
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
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);

app.use("/api/notifications", notificationRoutes);
server.listen(PORT, () => {
  console.log(`Server is running with WebSockets on port ${PORT}`);
});

export default app;