import { Connection, SqlClient, Error, Query, ProcedureManager } from "msnodesqlv8";
import { ErrorCodes, ErrorMessages, DB_CONNECTION_STRING, Queries} from "../constants";
import { ErrorHelper } from "../helpers/error.helper";
import { entityWithId, systemError } from "../entities";
import { textChangeRangeIsUnchanged } from "typescript";
import { ErrorService } from "../services/error.service";
import { AppError } from "../enums";

export class SqlHelper {
    static sql: SqlClient = require("msnodesqlv8"); //тут не надо конст

    public static executeQueryArrayResult<T>(errorService: ErrorService, query: string, ...params: (string | number)[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                resolve(queryResult);
                            }
                            else {
                                resolve([]);
                            }
                        }
                })
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

    public static executeQuerySingleResult<T>(errorService: ErrorService, query: string, ...params: (string | number)[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                    if (queryError) {
                        reject(errorService.getError(AppError.QueryError));
                    }
                    else {
                        const notFoundError: systemError = errorService.getError(AppError.NoDataFound);
                        if (queryResult !== undefined) {
                            switch (queryResult.length) {
                                case 0:
                                    reject(notFoundError);
                                    break;
                                case 1:
                                    resolve(queryResult[0]);
                                    break;
                                default: //In case more than a single result is return
                                    resolve(queryResult[0]);
                                    break;
                            }
                        }
                        else {
                            reject(notFoundError);
                        }
                    }
                    })
            })
    })
    }

    public static executeQueryNoResult(errorService: ErrorService, query: string, ignoreNoRowCount: boolean, ...params: (string | number | undefined)[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    const q: Query = connection.query(query, params, (queryError: Error | undefined, rows: any[] | undefined) => {
                        if (queryError) {
                            switch (queryError.code) {
                                case 547:
                                    reject(errorService.getError(AppError.DeletionConflict));
                                default:
                                    reject(errorService.getError(AppError.QueryError));
                            }
                        }
                    });
                q.on('rowcount', (rowCount: number) => {
                    //If not ignoring rows affected AND ALSO rows affected equals zero then
                    if ((rowCount === 0) && !ignoreNoRowCount) {
                        reject(errorService.getError(AppError.NoDataFound));
                        return; //return affects .on
                    }
                    resolve();
                });
                })
                .catch((error: systemError) => {
                    reject(error);
                })
                })
    }

    public static executeStoredProcedureGetId(errorService: ErrorService, procedureName: string, original: entityWithId, params: (string | number | undefined)[]): Promise<entityWithId> {
        return new Promise<entityWithId>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection) => {
                    const pm: ProcedureManager = connection.procedureMgr();
                    pm.callproc(procedureName, params, (storedProcedureError: Error | undefined, results: entityWithId[] | undefined, output: any[] | undefined) => {
                        if (storedProcedureError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            const id: number | null = SqlHelper.treatInsertResult2(results);
                            if (id !== null) {
                                original.id = id;
                                resolve(original);
                            }
                            else {
                                reject(errorService.getError(AppError.QueryError));
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }
     

    public static executeStoredProcedureGetArray<T>(errorService: ErrorService, procedureName: string, params?: (string | number | undefined)[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection) => {
                    const pm: ProcedureManager = connection.procedureMgr();
                    if (params === undefined) {
                        params = [];
                    }
                    pm.callproc(procedureName, params, (storedProcedureError: Error | undefined, results: T[] | undefined, output: any[] | undefined) => {
                        if (storedProcedureError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            if (results !== undefined) {
                                resolve(results);
                            }
                            else {
                                resolve([]);
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public static executeStoredProcedureNoResult(errorService: ErrorService, procedureName: string, ignoreNoRowCount: boolean, params: (string | number | undefined)[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    const pm: ProcedureManager = connection.procedureMgr();
                    const q: Query = pm.callproc(procedureName, params, (storedProcedureError: Error | undefined, results: any[] | undefined, output: any[] | undefined) => {
                        if (storedProcedureError) {
                            console.log(storedProcedureError);
                            reject(errorService.getError(AppError.QueryError));
                        }
                    });
                    q.on('rowcount', (rowCount: number) => {
                        if ((rowCount === 0) && !ignoreNoRowCount) {
                            reject(errorService.getError(AppError.NoDataFound));
                            return;
                        }
                        resolve();
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }


    private static openConnection(errorService: ErrorService): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
        SqlHelper.sql.open(DB_CONNECTION_STRING, (connectionError: Error, connection: Connection) => {  
                if (connectionError) {
                    reject(errorService.getError(AppError.ConnectionError));
                }
                else {
                    resolve(connection);
                }
                });
        });
    }

    private static treatInsertResult2(queryResult: entityWithId[] | undefined): number | null {
        if (queryResult !== undefined) {
            if (queryResult.length === 1) {
                return queryResult[0].id;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }

}