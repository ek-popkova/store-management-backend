import { Queries, StoredProcedures, TEMP_USER_ID } from "../constants";
import { SqlHelper } from "../helpers/sql.helper";
import { employee, entityWithId, relation, systemError } from "../entities";
import { Gender, Status } from "../enums";
import { ErrorService } from "./error.service";
import { DateHelper } from "../helpers/date.helper";

interface IEmployeeService {
    getAllEmployeeByStoreId(store_id: number): Promise<employee[]>;
    getEmployeeById(id: number): Promise<employee>;
    updateEmployee(employee: employee, userId: number): Promise<employee>;
    addEmployee(employee: employee, userId: number): Promise<employee>;
    deleteEmployee(employee_id: number, userId: number): Promise<void>;
}

interface localEmployee {
    id: number;
    first_name: string;
    last_name: string;
    birthdate: string;
    email: string;
    telephone: string;
    job_title_id: number;
    job_name: string;
    gender: Gender;
    address: string
}

export class EmployeeService implements IEmployeeService {

    constructor(
        private errorService: ErrorService
        //private - U can reference it from wherever in the class, public - wherever (not for beckend), nothing - only inside the constructor
    ) {}
    
    public getAllEmployeeByStoreId(store_id: number): Promise<employee[]> {
        return new Promise<employee[]>((resolve, reject) => {
            const result: employee[] = [];
            SqlHelper.executeQueryArrayResult<localEmployee>(this.errorService, Queries.getAllEmployeesByStoreId, store_id, Status.Active)
                .then((queryResult: localEmployee[]) => {
                    queryResult.forEach((employee: localEmployee) => {
                        result.push(this.parseLocalEmployee(employee));
                        })
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        })
    }

    public getEmployeeById(id: number): Promise<employee> {
        return new Promise<employee>((resolve, reject) => {
            SqlHelper.executeQuerySingleResult<localEmployee>(this.errorService, Queries.getEmployeeById, id, Status.Active)
                .then((queryResult: localEmployee) => {
                    resolve(this.parseLocalEmployee(queryResult))
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public updateEmployee(employee: employee, userId: number): Promise<employee> {
        return new Promise<employee>((resolve, reject) => {
            SqlHelper.executeStoredProcedureNoResult(this.errorService, StoredProcedures.updateEmployee, false, [employee.id, employee.first_name, employee.last_name, employee.birthdate, employee.email, employee.telephone, employee.job_title, employee.gender, employee.store_address, userId])
                .then(() => {
                    resolve(employee);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addEmployee(employee: employee, userId: number): Promise<employee> {
        return new Promise<employee>((resolve, reject) => {
            SqlHelper.executeStoredProcedureGetId(this.errorService, StoredProcedures.addEmployee, employee, [employee.first_name, employee.last_name, employee.birthdate, employee.email, employee.telephone, employee.job_title, employee.gender, employee.store_address, userId])
                .then(() => {
                    resolve(employee);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteEmployee(employee_id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.executeStoredProcedureNoResult(this.errorService, StoredProcedures.deleteEmployee, true, [employee_id, userId])
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    private parseLocalEmployee(local: localEmployee): employee {
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
}