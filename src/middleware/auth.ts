import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";
import sendResponse from "../utility/sendResponse";

const auth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized!!, No token provided",
                });
            }

            const decoded = jwt.verify(
                token as string,
                config.jwtSecretKey as string,
            ) as JwtPayload;

            const userData = await pool.query(
                `SELECT * FROM users WHERE id=$1`,
                [decoded.id],
            );

            const user = userData.rows[0];

            if (userData.rows.length === 0) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "Unauthorized!!, Invalid token",
                });
            }

            if (roles.length && !roles.includes(user.role)) {
                sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: "Forbidden!!, You don't have permission to access this resource",
                });
            }

            req.user = decoded; 
            next();
        } 
        catch (error) {
            next(error);
        }
    };
};

export default auth;
