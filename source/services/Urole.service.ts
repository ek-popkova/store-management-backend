import { QueryString, entityWithName, entityWithId } from "../entities";
import { ErrorService } from "./error.service";
import { UniversalService } from "./universal.service";

interface IRoleService<entityWithName> {
}

interface localRole extends entityWithId {
    role_name: string
}

export class URoleService extends UniversalService<entityWithName> implements IRoleService<entityWithName>{

    constructor(errorService: ErrorService, queries: QueryString)
    {
        super(errorService, queries)
    }

    parseLocalEntity(local: localRole): entityWithName {
        return {
            id: local.id,
            name: local.role_name
        };
    }

    parseParams(idRequired: boolean, entity: entityWithName, userId?: number): (string | number | undefined)[] {
        if (!idRequired) {
            return [entity.name, userId];
        }
        return [entity.id, entity.name, userId];
    }
}