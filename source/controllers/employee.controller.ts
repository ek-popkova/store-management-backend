import { Request, Response, NextFunction } from 'express';
import { EmployeeQueries, NON_EXISTENT_ID, PositionQueries, TEMP_USER_ID } from '../constants';
import { AuthenticatedRequest, employee, entityWithId, entityWithName, relation, systemError } from '../entities';
import { ResponseHelper } from '../helpers/controller.helper';
import { RequestHelper } from '../helpers/request.helper';
import { ErrorService } from '../services/error.service';
import { UEmployeeService } from '../services/Uemployee.service';
import { UPositionService } from '../services/Uposition.service';
import bcrypt from "bcryptjs"


const errorService: ErrorService = new ErrorService();
const UemployeeService: UEmployeeService = new UEmployeeService(errorService, EmployeeQueries);
const UpositionService: UPositionService = new UPositionService(errorService, PositionQueries);


//const employeeService: EmployeeService = new EmployeeService(errorService);


const getAllEmployeesByStoreId = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UemployeeService.getAllByGeneralId(numericParamOrError)
            .then((result: employee[]) => {
                return res.status(200).json({
                    employees: result
                });
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
        }
        else {
            //TODO error handling
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }  
};


const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UemployeeService.getEntityByIdSP(numericParamOrError)
            .then((result: entityWithId) => {
                return res.status(200).json(result as employee);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
        }
        else {
            //TODO error handling
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
    
};

const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: employee = req.body;
            body.id = numericParamOrError;
            UemployeeService.updateEntity(body, (req as AuthenticatedRequest).userData.userId)
            .then((result: employee) => {
                return res.status(200).json({
                    UPDvalues: result});
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            });
        }
        else {
            //TODO error handling
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
};

const addEmployee = async (req: Request, res: Response, next: NextFunction) => {
        
    const body: employee = req.body;
    const employee: employee = {
        id: NON_EXISTENT_ID,
        first_name: body.first_name,
        last_name: body.last_name,
        birthdate: body.birthdate,
        email: body.email,
        telephone: body.telephone,
        job_title: body.job_title,
        gender: body.gender,
        store_address: body.store_address
    };

    UemployeeService.addEntity(employee, (req as AuthenticatedRequest).userData.userId)
        .then((result: entityWithId) => {
            return res.status(200).json(result as employee);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UemployeeService.deleteEntity(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
            .then(() => {
                return res.sendStatus(200);
            })
            .catch((error: systemError) => {
                return ResponseHelper.handleError(res, error);
            })
        }
        else {
            //TODO error handling
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
};

const addRelation = async (req: Request, res: Response, next: NextFunction) => {
        
    const body: relation = req.body;
    const relation: relation = {
        chief_id: body.chief_id,
        sub_id: body.sub_id
    };

    UemployeeService.addRelation(relation, (req as AuthenticatedRequest).userData.userId)
        .then(() => {
            return res.status(200).json(relation);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const deleteRelation = async (req: Request, res: Response, next: NextFunction) => {
        
    const body: relation = req.body;
    const relation: relation = {
        chief_id: body.chief_id,
        sub_id: body.sub_id
    };

    UemployeeService.deleteRelation(relation, (req as AuthenticatedRequest).userData.userId)
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};


const getAllPositions = async (req: Request, res: Response, next: NextFunction) => {

    UpositionService.getAll()
        .then((result: entityWithName[]) => {
            return res.status(200).json({
                positions: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
    
};


export default {getAllEmployeesByStoreId, getEmployeeById, updateEmployee, addEmployee, deleteEmployee, addRelation, deleteRelation, getAllPositions};