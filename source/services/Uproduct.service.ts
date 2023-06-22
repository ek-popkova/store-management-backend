import { Queries, StoredProcedures, TEMP_USER_ID } from "../constants";
import { SqlHelper } from "../helpers/sql.helper";
import { employee, entityWithId, relation, systemError, QueryString, product } from "../entities";
import { Gender, Status } from "../enums";
import { ErrorService } from "./error.service";
import { DateHelper } from "../helpers/date.helper";
import { UniversalService } from "./universal.service";

interface IProductService<product> {
}

interface localProduct extends entityWithId{
    vendor_code: string;
    name: string;
    price: number;
    location: string;
    category: string
}

export class UProductService extends UniversalService<product> implements IProductService<product>{

    constructor(errorService: ErrorService, queries: QueryString)
    {
        super(errorService, queries)
    }

    parseLocalEntity(local: localProduct): product {
        return {
            id: local.id,
            vendor_code: local.vendor_code,
            name: local.name,
            price: local.price,
            location: local.location,
            category: local.category
        };
    }

    parseParams(idRequired: boolean, entity: product, userId?: number): (string | number | undefined)[] {
        if (!idRequired) {
            return [entity.vendor_code, entity.name, entity.price, 
            entity.location, entity.category, userId];
        }
        return [entity.id, entity.vendor_code, entity.name, entity.price, 
            entity.location, entity.category, userId];
    }
}