import {Dictionary} from "underscore"
import { systemError } from "../entities";
import { AppError } from "../enums";

interface IErrorService {
    getError(key: AppError): systemError;
}

export class ErrorService implements IErrorService {
    private _error: Dictionary<systemError> = {};

    constructor() {
        this.initializeErrors();
    }

    private initializeErrors() {
        this._error[AppError.General] = {
            key: AppError.General,
            code: 99,
            message: "General Error. Debug me!"
        };
        this._error[AppError.ConnectionError] = {
            key: AppError.ConnectionError,
            code: 100,
            message: "DB server connection error"
        };
        this._error[AppError.QueryError] = {
            key: AppError.QueryError,
            code: 101,
            message: "Incorrect query"
        };
        this._error[AppError.NoDataFound] = {
            key: AppError.NoDataFound,
            code: 102,
            message: "NoDataFound"
        };
        this._error[AppError.NonNumericInput] = {
            key: AppError.NonNumericInput,
            code: 103,
            message: "Non numeric input suplied"
        };
        this._error[AppError.InputParametrsNotSupplied] = {
            key: AppError.InputParametrsNotSupplied,
            code: 104,
            message: "Input parametrs are not supplied"
        };
        this._error[AppError.DeletionConflict] = {
            key: AppError.DeletionConflict,
            code: 105,
            message: "Deletion is not possible due to refferenced record"
        };
        this._error[AppError.SPNotProvided] = {
            key: AppError.SPNotProvided,
            code: 106,
            message: "The operation is not provided for this object"
        };
    }

    public getError(key: AppError): systemError {
        return this._error[key];
    } 
}