export const ErrorCode = {
    NOT_FOUND: {
        code: "NOT_FOUND",
        statusCode: 404,
    },
    VALIDATION_ERROR: {
        code: "VALIDATION_ERROR",
        statusCode: 400,
    },
    UNAUTHORIZED: {
        code: "UNAUTHORIZED",
        statusCode: 401,
    },
    FORBIDDEN: {
        code: "FORBIDDEN",
        statusCode: 403,
    },
    CONFLICT: {
        code: "CONFLICT",
        statusCode: 409,
    },
    INTERNAL_SERVER_ERROR: {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
    },
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
