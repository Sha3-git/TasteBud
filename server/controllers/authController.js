const path = require("path");
const authService = require("../services/authService");

const registerUser = async (req, res) => {
    try {
        await authService.register(req.body);
        res.status(201).json({
            status: "success",
            message: "Check your email for verification link."
        });

    } catch (err) {
        console.log(err);

        let statusCode = 500;

        if (err.message === "duplicate email") {
            statusCode = 409;
        }

        res.status(statusCode).json({
            error: err.message
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        await authService.verifyEmail(req.query.token);
        res.sendFile(
            path.join(__dirname, "public", "verification-success.html")
        );
    } catch (err) {
        res.sendFile(
            path.join(__dirname, "public", "verification-expired.html")
        );
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
