import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

export const getImageKitAuth = (req, res) => {
    try {
        const authenticationParameters =
            imagekit.helper.getAuthenticationParameters();

        res.status(200).json({
            token: authenticationParameters.token,
            expire: authenticationParameters.expire,
            signature: authenticationParameters.signature,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY
        });

    } catch (error) {
        console.error("ImageKit authentication error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate ImageKit authentication"
        });
    }
};
