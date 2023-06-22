import { SqlHelper } from "../helpers/sql.helper";
import { entityWithId,  QueryString,  systemError } from "../entities";
import { AppError, Status } from "../enums";
import { ErrorService } from "./error.service";
import { FAKE_STRING } from "../constants";

interface IUniversalService<T> { 
    getEntityByIdSP(id: number): Promise<T>;
    getAllByGeneralId(general_id: number): Promise<T[]>;
    getAll(): Promise<T[]>;
    updateEntity(entity: T, userId: number): Promise<T>;
    addEntity(entity: T, userId: number): Promise<T>;
    deleteEntity(entity_id: number, userId: number): Promise<void>;
}

export abstract class UniversalService<T> implements IUniversalService<T> {

    constructor(
        //can inherited objects get private errorService
        public errorService: ErrorService,
        private queries: QueryString
        //private - U can reference it from wherever in the class, public - wherever (not for beckend), nothing - only inside the constructor
    ) {}
    

    // public getEntityByIdQuery(id: number): Promise<entityWithId> {
    //     return new Promise<entityWithId>((resolve, reject) => {
    //         SqlHelper.executeQuerySingleResult<entityWithId>(this.errorService, this.queries.getByIdQ, id, Status.Active)
    //             .then((queryResult: entityWithId) => {
    //                 resolve(this.parseLocalEntity(queryResult))
    //             })
    //             .catch((error: systemError) => {
    //                 reject(error);
    //             });
    //     });
    // }

    public getEntityByIdSP(id: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (this.queries.getByIdSP === FAKE_STRING) {
                reject(this.errorService.getError(AppError.SPNotProvided))
            }
            else {
            SqlHelper.executeStoredProcedureGetArray<entityWithId>(this.errorService, this.queries.getByIdSP, [id])
                .then((queryResult: entityWithId[]) => {
                    switch (queryResult.length) {
                        case 0:
                            reject(this.errorService.getError(AppError.NoDataFound));
                            break;
                        case 1:
                            resolve(this.parseLocalEntity(queryResult[0]));
                            break;
                        default: //In case more than a single result is return
                            resolve(this.parseLocalEntity(queryResult[0]));
                            break;
                    }

                })
                .catch((error: systemError) => {
                    reject(error);
                });
            }
        });
    }

    public getAllByGeneralId(general_id: number): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const result: T[] = [];
            if (this.queries.getByGeneralIdSP === FAKE_STRING) {
                reject(this.errorService.getError(AppError.SPNotProvided))
            }
            else {
            SqlHelper.executeStoredProcedureGetArray<entityWithId>(this.errorService, this.queries.getByGeneralIdSP, [general_id])
                .then((queryResult: entityWithId[]) => {
                    queryResult.forEach((entity: entityWithId) => {
                        result.push(this.parseLocalEntity(entity));
                        })
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
            }
        })
    }

    public getAll(): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const result: T[] = [];
            if (this.queries.getAllSP === FAKE_STRING) {
                reject(this.errorService.getError(AppError.SPNotProvided))
            }
            else {
            SqlHelper.executeStoredProcedureGetArray<entityWithId>(this.errorService, this.queries.getAllSP)
                .then((queryResult: entityWithId[]) => {
                    queryResult.forEach((entity: entityWithId) => {
                        result.push(this.parseLocalEntity(entity));
                        })
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
            }
        })
    }

    public updateEntity(entity: T, userId: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (this.queries.updateSP === FAKE_STRING) {
                reject(this.errorService.getError(AppError.SPNotProvided))
            }
            else {
            SqlHelper.executeStoredProcedureNoResult(this.errorService, this.queries.updateSP, false, this.parseParams(true, entity, userId))
                .then(() => {
                    resolve(entity);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
            }
        });
    }

    public addEntity(entity: T, userId: number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (this.queries.addSP === FAKE_STRING) {
                reject(this.errorService.getError(AppError.SPNotProvided))
            }
            else {
            SqlHelper.executeStoredProcedureGetId(this.errorService, this.queries.addSP, (entity as entityWithId), this.parseParams(false, entity, userId))
                .then(() => {
                    resolve(entity);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
            }
        });
    }

    public deleteEntity(entity_id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.queries.deleteSP === FAKE_STRING) {
                reject(this.errorService.getError(AppError.SPNotProvided))
            }
            else {
            SqlHelper.executeStoredProcedureNoResult(this.errorService, this.queries.deleteSP, true, [entity_id, userId])
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
            }
        });
    }

    abstract parseLocalEntity(local: entityWithId): T;
    abstract parseParams(idRequired: boolean, entity: T, userId?: number): (string | number | undefined)[];
}