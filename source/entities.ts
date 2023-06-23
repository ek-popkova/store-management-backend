import { Gender, Role } from "./enums";
import { Request } from 'express';


export interface entityWithId {
    id: number;
}

export interface store extends entityWithId {
    address: string;
    area: number;
    category_id?: number;
    category_name?: string;
}

export interface employee extends entityWithId {
    first_name: string;
    last_name: string;
    birthdate: string;
    email: string;
    telephone: string;
    job_title_id?: number;
    job_title?: string;
    gender: Gender;
    store_address?: string;
    // login: string;
    // password: string;
}

export interface user extends entityWithId {
    login: string;
    password: string;
    role: string;
    email: string;
}
export interface relation {
    chief_id: number;
    sub_id: number;
}

export interface product extends entityWithId {
    vendor_code: string;
    name: string;
    price: number;
    location: string;
    category: string
}

export interface entityWithName extends entityWithId {
    name: string
}
export interface systemError {
    key: string;
    code: number;
    message: string;
}

export interface jwtUserData {
    userId: number,
    roleID: Role[];
}

export interface authenticationToken {
    userData: jwtUserData;
}

export interface AuthenticatedRequest extends Request, authenticationToken {
}

export interface QueryString {
    getAllSP: string;
    getByGeneralIdSP: string;
    getByIdSP: string;
    updateSP: string;
    addSP: string;
    deleteSP: string;
}
