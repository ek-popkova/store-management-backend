import { QueryString, entityWithName, entityWithId } from "../entities";
import { ErrorService } from "./error.service";
import { UniversalService } from "./universal.service";

interface ILocationService<entityWithName> {
}

interface localLocation extends entityWithId {
    name: string
}

export class ULocationService extends UniversalService<entityWithName> implements ILocationService<entityWithName> {

    constructor(errorService: ErrorService, queries: QueryString)
    {
        super(errorService, queries)
    }

    parseLocalEntity(local: localLocation): entityWithName {
        return {
            id: local.id,
            name: local.name
        };
    }

    parseParams(idRequired: boolean, entity: entityWithName, userId?: number): (string | number | undefined)[] {
        if (!idRequired) {
            return [entity.name, userId];
        }
        return [entity.id, entity.name, userId];
    }
}