export class ApiError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly statusCode: number,
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}
