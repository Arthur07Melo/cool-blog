

declare namespace Express {
    export interface Request {
        user: Partial<{
            id: string,
            username: string,
            email: string
        }>
    }
}