import { Queries, StoredProcedures } from "../constants";
import { SqlHelper } from "../helpers/sql.helper";
import { employee, relation, systemError, QueryString, entityWithId, jwtUserData } from "../entities";
import { AppError, Gender, Role } from "../enums";
import { ErrorService } from "./error.service";
import { UniversalService } from "./universal.service";
import bcrypt from "bcryptjs"


interface IEmployeeService<employee> {
    addRelation(relation: relation, userId: number): Promise<void>;
    deleteRelation(relation: relation, userId: number): Promise<void>;
}

interface localEmployee extends entityWithId {
    first_name: string;
    last_name: string;
    birthdate: string;
    email: string;
    telephone: string;
    job_title_id: number;
    job_name: string;
    gender: Gender;
    address: string;
}


export class UEmployeeService extends UniversalService<employee> implements IEmployeeService<employee> {

    constructor(errorService: ErrorService, queries: QueryString)
    {
        super(errorService, queries)
    }

    public addRelation(relation: relation, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.executeStoredProcedureNoResult(this.errorService, StoredProcedures.addRelation, false, [relation.chief_id, relation.sub_id, userId])
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteRelation(relation: relation, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.executeStoredProcedureNoResult(this.errorService, StoredProcedures.deleteRelation, true, [relation.chief_id, relation.sub_id, userId])
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }


    parseLocalEntity(local: localEmployee): employee {
        return {
            id: local.id,
            first_name: local.first_name,
            last_name: local.last_name,
            birthdate: local.birthdate,
            email: local.email,
            telephone: local.telephone,
            job_title: local.job_name,
            gender: local.gender,
            store_address: local.address
        };
    }

    parseParams(idRequired: boolean, entity: employee, userId?: number): (string | number | undefined)[] {
        if (!idRequired) {
            return [entity.first_name, entity.last_name, entity.birthdate, 
            entity.email, entity.telephone, entity.job_title, entity.gender, entity.store_address, userId];
        }
        return [entity.id, entity.first_name, entity.last_name, entity.birthdate, 
            entity.email, entity.telephone, entity.job_title, entity.gender, entity.store_address, userId];
    }
}