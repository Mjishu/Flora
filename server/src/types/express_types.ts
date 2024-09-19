
namespace Express {
    interface User {
        id: string; // UUID or number depending on your setup
        email: string;
        username: string
    }

    export interface Request {
        user?: User;
    }
}

