import { Queries, StoredProcedures, TEMP_USER_ID } from "../constants";
import { SqlHelper } from "../helpers/sql.helper";
import { entityWithId, store, systemError } from "../entities";
import { Status } from "../enums";
import { ErrorService } from "./error.service";
import { DateHelper } from "../helpers/date.helper";

interface IStoreService {
    getAllStores(): Promise<store[]>;
    getStoreById(id: number): Promise<store>;
    updateStore(store: store, userId: number): Promise<store>;
    deleteStoreById(id: number,  userId: number): Promise<void>;
    addStore(store: store, userId: number): Promise<store>;
}

interface localStore {
    id: number;
    address: string;
    area: number;
    category_id: number;
    category_name: string;
}

export class StoreService implements IStoreService {

    constructor(
        private errorService: ErrorService
        //private - U can reference it from wherever in the class, public - wherever (not for beckend), nothing - only inside the constructor
    ) {}
    
    public getAllStores(): Promise<store[]> {
        return new Promise<store[]>((resolve, reject) => {
            const result: store[] = [];
            SqlHelper.executeQueryArrayResult<localStore>(this.errorService, Queries.getAllStores, Status.Active)
                .then((queryResult: localStore[]) => {
                    queryResult.forEach((store: localStore) => {
                        result.push(this.parseLocalStore(store));
                        })
                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        })
    }

    public getStoreById(id: number): Promise<store> {
         return new Promise<store>((resolve, reject) => {
             SqlHelper.executeQuerySingleResult<localStore>(this.errorService, Queries.getStoreById, id, Status.Active)
                 .then((queryResult: localStore) => {
                     resolve(this.parseLocalStore(queryResult))
                 })
                 .catch((error: systemError) => {
                     reject(error);
                 });
         });
     }

    public updateStore(store: store, userId: number): Promise<store> {
        return new Promise<store>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult(this.errorService, Queries.updateStore, false, store.address, store.area, store.category_id, DateHelper.dateToString(updateDate), userId, store.id, Status.Active)
                .then(() => {
                    resolve(store);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteStoreById(id: number,  userId: number): Promise<void> {
        let result: store;
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult(this.errorService, Queries.deleteStore, true, DateHelper.dateToString(updateDate), userId, Status.NotActive, id, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addStore(store: store, userId: number): Promise<store> {
        return new Promise<store>((resolve, reject) => {
            SqlHelper.executeStoredProcedureGetId(this.errorService, StoredProcedures.addStore, store, [store.address, store.area, store.category_name, userId])
                .then(() => {
                    resolve(store);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }
    
    private parseLocalStore(local: localStore): store {
        return {
            id: local.id,
            address: local.address,
            area: local.area,
            category_name: local.category_name,
            category_id: local.category_id
        };
    }
}