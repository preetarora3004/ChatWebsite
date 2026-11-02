export const SuccessCode = {
    OK: {
        code: "OK",
        statusCode: 200,
    },
    CREATED: {
        code: "CREATED",
        statusCode: 201,
    },
    ACCEPTED: {
        code: "ACCEPTED",
        statusCode: 202,
    },
    NO_CONTENT: {
        code: "NO_CONTENT",
        statusCode: 204,
    },
} as const;

export type SuccessCodeKey = keyof typeof SuccessCode;

export type SuccessCode =
    (typeof SuccessCode)[SuccessCodeKey];
