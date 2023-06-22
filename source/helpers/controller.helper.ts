import { systemError } from "../entities";
import { Response } from 'express';
import { ErrorCodes } from "../constants";



export class ResponseHelper {
    public static handleError(response: Response, error: systemError, isAuthentification: boolean = false): Response<any, Record<string, any>> {
        switch (error.code) {
            case ErrorCodes.ConnectionError:
                return response.status(408).json({
                    errorMassage: error.message
                });
            case ErrorCodes.QueryError:
            case ErrorCodes.NonNumericInput:
                return response.status(406).json({
                     errorMassage: error.message
                });
            case ErrorCodes.NoDataFound:
                if (isAuthentification) {
                    return response.sendStatus(403);
                }
                else {
                return response.status(404).json({
                    errorMessage: error.message
                });
                }
            default:
                return response.status(400).json({
                    errorMassage: error.message
                });
        }
    }
}