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
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};

const getIssues = async (req: Request, res: Response) => {
    try {
        const { type, status, sort } = req.query;
        const result = await issuesService.getAllIssuesFromDB(req.query);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: result,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
}

const getIssueById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await issuesService.getIssueByIdFromDB(id as string);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieved successfully",
            data: result,
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
}

export const issuesController = {
    createIssue,
    getIssues,
    getIssueById
};