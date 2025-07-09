declare global {
    namespace Express {
        interface Request {
            userRoles?: string[];
        }
    }
}

export {};
