import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/users";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {

    try {
        const { firstName, lastName, email, password, role } = req.body;
        const validRoles = ["user", "business"];
        const userRole = validRoles.includes(role) ? role : "user";
        let ExistUser = await User.findOne({
            email,
        }).exec();
        if (ExistUser)
            return res.status(400).json({
                status: false,
                isEmailUsed: true,
                message: "Email is already in use!",
            });
        const hashedPassword = await bcrypt.hash(password, 10); // hash here

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            role: userRole,
        });
        await user.save();

        return res.status(200).json({
            statue: true,
            isEmailUsed: false,
            message: "Added successfully ",
        });
    } catch (err: unknown) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Server error. Try again." });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ statue: false, message: "verify your data" });
        const user = await User.findOne({ email }).exec();

        if (!user)
            return res.status(404).json({ statue: false, message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ statue: false, message: "Password Incorrect " });

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        const { password: _, ...userData } = user.toObject();

        res.json({ status: true, user: userData, token });
    } catch (err: unknown) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Server error. Try again." });
    }
};

