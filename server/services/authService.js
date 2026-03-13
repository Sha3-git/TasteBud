const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
});


const createVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString("hex");
};

const register = async (data) => {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("duplicate email");

    const hashed = await bcrypt.hash(data.password, 10);
    const verificationToken = createVerificationToken();

    const user = await User.create({
        email: data.email,
        password: hashed,
        firstName: data.firstName,
        lastName: data.lastName,
        verificationToken,
        verificationExpires: Date.now() + 1000 * 60 * 60 // 1 hour
    });

    const verificationUrl = `${process.env.CLIENT_URL}/verify?token=${verificationToken}`;

    await transporter.sendMail({
        from: `"TasteBud" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Verify your email",
        html: `
            <h2>Welcome to TasteBud!</h2>
            <p>Please verify your email by clicking below:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This link expires in 1 hour.</p>
        `
    });

    return user;
};

const verifyEmail = async (token) => {
    const user = await User.findOne({
        verificationToken: token,
        verificationExpires: { $gt: Date.now() }
    });

    if (!user) throw new Error("invalid or expired");
    if (user.verified) {
        return user;
    }
    user.verified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    return user;
};

const resendVerification = async (email) => {
    const user = await User.findOne({ email });

    if (!user) throw new Error("user_not_found");
    if (user.verified) throw new Error("already_verified");

    const newToken = crypto.randomBytes(32).toString("hex");

    user.verificationToken = newToken;
    user.verificationExpires = Date.now() + 1000 * 60 * 60; 

    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/auth/verify?token=${newToken}`;

    await transporter.sendMail({
        from: `"TasteBud" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Resend: Verify your email",
        html: `
            <h2>Verify Your Email</h2>
            <p>Click below to verify:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This link expires in 1 hour.</p>
        `
    });

    return true;
};


const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("invalid_credentials");
    if (!await bcrypt.compare(password, user.password))
        throw new Error("invalid credentials");

    if (!user.verified)
        throw new Error("email not verified");
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
    const user = await User.findOne({ "refreshTokens.token": refreshToken });
    if (!user) throw new Error("invalid_refresh");

    const accessToken = generateAccessToken(user);
    return { accessToken };
};

module.exports = {
    register,
    verifyEmail,
    login,
    refreshAccessToken,
};
