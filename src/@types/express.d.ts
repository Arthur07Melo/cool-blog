

declare namespace Express {
    export interface Request {
        user: Partial<{
            id: String,
            username: String,
            email: String
        }>
    }
}