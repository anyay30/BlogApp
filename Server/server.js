import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import blogRoutes from "./routes/blogRoutes.js";
//import ImageKit from "@imagekit/nodejs";
import aiRoutes from "./routes/aiRoutes.js";
import imagekitRoutes from "./routes/imagekitRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
// const imageKit = new ImageKit({
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY
// });

app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());



connectDB();

app.use("/api/blogs", blogRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/imagekit", imagekitRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);



app.get("/", (req, res) => {
    res.json({
        message: "SmartBlog API is running"
    });
});

const PORT = process.env.PORT || 5000;

// app.get("/api/imagekit-auth", (req, res) => {
//     try {
//         const { token, expire, signature } =
//             imageKit.helper.getAuthenticationParameters();

//         res.json({
//             token,
//             expire,
//             signature,
//             publicKey: process.env.IMAGEKIT_PUBLIC_KEY
//         });

//     } catch (error) {
//         console.error("ImageKit authentication error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Failed to generate ImageKit authentication"
//         });
//     }
// });
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
