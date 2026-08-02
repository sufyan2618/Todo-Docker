import User from "../models/user.model.js";
import { ENV } from "../util/dotenv.js";
import { generateToken } from "../util/generateToken.js";
import { logger } from "../config/logger.js";

export const register = async (req, res) => {
    logger.info(`Registration attempt: ${req.body.email}`);
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const user = await User.create({ firstName, lastName, email, password });

        const token = generateToken({ id: user._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 3600000,
        });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            },
            accessToken: token,
            message: "User registered successfully",
        });
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    logger.info(`Login attempt: ${req.body.email}`);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message:
                    "Account is temporarily blocked due to multiple failed login attempts. Please contact support.",
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            user.incrementLoginAttempts();

            if (user.loginAttempts >= 5) {
                user.blockAccount();
            }

            await user.save();

            const attemptsRemaining = Math.max(0, 5 - user.loginAttempts);

            return res.status(400).json({
                success: false,
                message:
                    attemptsRemaining > 0
                        ? `Invalid credentials. ${attemptsRemaining} attempts remaining.`
                        : "Account blocked due to too many failed attempts.",
            });
        }

        user.resetLoginAttempts();
        user.isBlocked = false;
        await user.save();

        const token = generateToken({ id: user._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 3600000,
        });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            },
            accessToken: token,
            message: "Login successful",
        });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: "Lax",
    });
    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password -loginAttempts -isBlocked"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        logger.error(`Get profile error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
