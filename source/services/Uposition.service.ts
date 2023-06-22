import { QueryString, entityWithName, entityWithId } from "../entities";
import { ErrorService } from "./error.service";
import { UniversalService } from "./universal.service";

interface IPositionService<entityWithName> {
}

interface localPosition extends entityWithId {
    job_name: string
}

export class UPositionService extends UniversalService<entityWithName> implements IPositionService<entityWithName> {

    constructor(errorService: ErrorService, queries: QueryString)
    {
        super(errorService, queries)
    }

    parseLocalEntity(local: localPosition): entityWithName {
        return {
            id: local.id,
            name: local.job_name
        };
    }

    parseParams(idRequired: boolean, entity: entityWithName, userId?: number): (string | number | undefined)[] {
        if (!idRequired) {
            return [entity.name, userId];
        }
        return [entity.id, entity.name, userId];
    }
}