const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    if (existing) throw new Error("duplicate_email");

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

    return { user, verificationToken };
};

const verifyEmail = async (token) => {
    const user = await User.findOne({
        verificationToken: token,
        verificationExpires: { $gt: Date.now() }
    });

    if (!user) throw new Error("invalid_or_expired");

    user.verified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    return user;
};

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("invalid_credentials");

    if (!await bcrypt.compare(password, user.password))
        throw new Error("invalid_credentials");

    if (!user.verified)
        throw new Error("email_not_verified");

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
