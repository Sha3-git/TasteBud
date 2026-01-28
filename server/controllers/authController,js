const authService = require("../services/authService");

const sendVerificationEmail = async (email, token) => {
    //nodemailer implememt later
};

const registerUser = async (req, res) => {
    try {
        const { user, verificationToken } =
            await authService.register(req.body);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            status: "success",
            message: "Check your email for verification link."
        });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        await authService.verifyEmail(req.query.token);
        res.json({ status: "success", message: "Email verified!" });
    } catch (err) {
        res.status(400).json({ error: "Invalid or expired token" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { user, accessToken, refreshToken } =
            await authService.login(email, password);

        res.json({
            status: "success",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.firstName
            }
        });

    } catch (err) {
        if (err.message === "invalid_credentials")
            return res.status(400).json({ error: "Invalid login" });

        if (err.message === "email_not_verified")
            return res.status(401).json({ error: "Verify your email first" });

        res.status(500).json({ error: "Server error" });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { accessToken } =
            await authService.refreshAccessToken(req.body.refreshToken);

        res.json({ accessToken });

    } catch {
        res.status(400).json({ error: "Invalid refresh token" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    refreshToken
};
