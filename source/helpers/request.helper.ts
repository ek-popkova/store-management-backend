import { systemError } from '../entities';
import { AppError } from '../enums';
import { ErrorService } from '../services/error.service';

export class RequestHelper {
    public static ParseNumericInput(errorService: ErrorService, input: string): number | systemError {
        let result: number = -1;
        
        if (isNaN(Number(input))) {
            return errorService.getError(AppError.NonNumericInput);
        }
        if (input !== null && input !== undefined) {
            result = parseInt(input);
        }
        else {
            return errorService.getError(AppError.InputParametrsNotSupplied);
        }
        return result;
    }
}