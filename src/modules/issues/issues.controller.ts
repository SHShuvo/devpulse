import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issuesService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const result = await issuesService.createIssueIntoDB(req.body, req.user?.id); 
        sendResponse(res, {
            statusCode: 201,
            success: true,  
            message: "Issue created successfully",
            data: result.rows[0],
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Internal server error",
        });
    }
};

export const issuesController = {
    createIssue,
};