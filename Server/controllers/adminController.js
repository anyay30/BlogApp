import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Admin credentials
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email !== adminEmail || password !== adminPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {

        console.error("Admin login error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};