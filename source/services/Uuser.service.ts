import { Queries, StoredProcedures } from "../constants";
import { SqlHelper } from "../helpers/sql.helper";
import { employee, relation, systemError, QueryString, entityWithId, jwtUserData, user } from "../entities";
import { AppError, Gender, Role } from "../enums";
import { ErrorService } from "./error.service";
import { UniversalService } from "./universal.service";
import bcrypt from "bcryptjs"


interface IUserService<user> {
}

interface localUser extends entityWithId {
    login: string;
    password: string;
    email: string
}


export class UUserService extends UniversalService<user> implements IUserService<user> {

    constructor(errorService: ErrorService, queries: QueryString)
    {
        super(errorService, queries)
    }

    parseLocalEntity(local: localUser): user {
        return {
            id: local.id,
            login: local.login,
            password: local.password,
            email: local.email
        };
    }

    parseParams(idRequired: boolean, entity: user, userId?: number): (string | number | undefined)[] {
        if (!idRequired) {
            return [entity.login, entity.password, entity.role, entity.email, userId];
        }
        return [entity.id, entity.login, entity.role, entity.email, entity.password, userId];
    }
}