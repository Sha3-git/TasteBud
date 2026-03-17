const path = require("path");
const authService = require("../services/authService");
const auth = require("../middlewares/auth");

const registerUser = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            status: "success",
            message: "Check your email for verification link.",
            id: user._id,
        });

    } catch (err) {

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
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "Validation error" });
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Validation error" });
        }
        const { user, accessToken, refreshToken } =
            await authService.login(email, password);
        res.json({
            status: "success",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (err) {
        if (err.message === "invalid credentials")
            return res.status(401).json({ error: "Unauthorized" });

        if (err.message === "email not verified")
            return res.status(401).json({ error: "Unauthorized" });

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


const resendVerificationEmail = async (req, res) => {
  try {
    await authService.resendVerification(req.body.email);
    res.json({ status: "sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const checkVerificationStatus = async (req, res) => {
  const user = await authService.checkVerificationStatus(req.body.email);
  if (!user) {
    return res.status(404).json({ verified: false });
  }
  res.json({ verified: user.verified });
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    refreshToken,
    checkVerificationStatus,
    resendVerificationEmail
};
