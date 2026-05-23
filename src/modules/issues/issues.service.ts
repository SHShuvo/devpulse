import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue, reporter_id: number) => {
    const { title, description, type, status } = payload;

    const result = await pool.query(
        `INSERT INTO issues (title, description, type, status, reporter_id)
        VALUES ($1, $2, $3, COALESCE($4, 'open'), $5)
        RETURNING *`,
        [title, description, type, status, reporter_id],
    );
    return result;
};

const getAllIssuesFromDB = async (query_params: any) => {
    const { sort = "newest", type, status } = query_params;
    let query = `
        SELECT 
            issues.id,
            issues.title,
            issues.description,
            issues.type,
            issues.status,
            issues.created_at,
            issues.updated_at,

            users.id AS reporter_id,
            users.name AS reporter_name,
            users.role AS reporter_role

        FROM issues
        LEFT JOIN users 
            ON issues.reporter_id = users.id
    `;

    const values: any[] = [];
    const conditions: string[] = [];

    if (type) {
        values.push(type);
        conditions.push(`issues.type = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`issues.status = $${values.length}`);
    }

    if (conditions.length) {
        query += ` WHERE ` + conditions.join(" AND ");
    }

    query += sort === "oldest"
        ? ` ORDER BY issues.created_at ASC`
        : ` ORDER BY issues.created_at DESC`;

    const result = await pool.query(query, values);

    const data = result.rows.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        status: row.status,
        reporter: row.reporter_id
            ? {
                id: row.reporter_id,
                name: row.reporter_name,
                role: row.reporter_role,
            }
            : null,
        created_at: row.created_at,
        updated_at: row.updated_at,
    }));

    return data;
}

const getIssueByIdFromDB = async (id: string) => {
    const query = `
        SELECT 
            issues.id,
            issues.title,
            issues.description,
            issues.type,
            issues.status,
            issues.created_at,
            issues.updated_at,

            users.id AS reporter_id,
            users.name AS reporter_name,
            users.role AS reporter_role

        FROM issues
        LEFT JOIN users 
            ON issues.reporter_id = users.id
        WHERE issues.id = $1
        LIMIT 1
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
        throw new Error("Issue not found");
    }

    const row = result.rows[0];

    const data = {
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        status: row.status,
        reporter: row.reporter_id
            ? {
                id: row.reporter_id,
                name: row.reporter_name,
                role: row.reporter_role,
            }
            : null,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
    return data;
}
    

export const issuesService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getIssueByIdFromDB
};  