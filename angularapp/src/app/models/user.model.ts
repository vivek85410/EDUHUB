export interface User {
    userId?: number;
    email: string;
    password: string;
    username: string;
    mobileNumber: string;
    userRole: string;
    profilePictureUrl?: string;
    authorizationKey?: string;
}