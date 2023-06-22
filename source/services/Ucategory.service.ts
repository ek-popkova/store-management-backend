import { QueryString, entityWithName, entityWithId } from "../entities";
import { ErrorService } from "./error.service";
import { UniversalService } from "./universal.service";

interface ICategoryService<entityWithName> {
}

interface localCategory extends entityWithId {
    category_name: string
}

export class UCategoryService extends UniversalService<entityWithName> implements ICategoryService<entityWithName>{

    constructor(errorService: ErrorService, queries: QueryString)
    {
        super(errorService, queries)
    }

    parseLocalEntity(local: localCategory): entityWithName {
        return {
            id: local.id,
            name: local.category_name
        };
    }

    parseParams(idRequired: boolean, entity: entityWithName, userId?: number): (string | number | undefined)[] {
        if (!idRequired) {
            return [entity.name, userId];
        }
        return [entity.id, entity.name, userId];
    }
}