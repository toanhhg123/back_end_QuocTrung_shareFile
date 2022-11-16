import { Request } from 'express';


export interface IUserRegister {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    schoolId: string;
    dateOfBirth: Date;
}

export interface IUserResponse {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    schoolId: string;
    dateOfBirth: Date;
    role: string;
}

export interface IUserRequest extends Request {
    user?: IUserResponse;
}
