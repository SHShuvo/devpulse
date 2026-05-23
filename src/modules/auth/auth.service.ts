import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUserIntoDB = async (payload: IUser) => {
    const { name, email, password, role } = payload;

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING *`,
        [name, email, hashPassword, role],
    );

    delete result.rows[0].password;

    return result;
};

const loginUserIntoDB = async (payload: { email: string; password: string }) => {
    const { email, password } = payload;

    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid Credentials");
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid Credentials");
    }

    const jwtpayload = {
        id: user.id,
        name: user.name,
        role: user.role,
    };

    const token = jwt.sign(jwtpayload, config.jwtSecretKey as string, {
        expiresIn: "1d",
    });

    delete user.password;
    return { token, user };
};



export const authService = {
    signupUserIntoDB,
    loginUserIntoDB,
};  