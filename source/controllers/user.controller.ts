import { Request, Response, NextFunction } from 'express';
import { EmployeeQueries, NON_EXISTENT_ID, PositionQueries, TEMP_USER_ID, UserQueries } from '../constants';
import { AuthenticatedRequest, user, entityWithId, entityWithName, relation, systemError } from '../entities';
import { ResponseHelper } from '../helpers/controller.helper';
import { RequestHelper } from '../helpers/request.helper';
import { ErrorService } from '../services/error.service';
import bcrypt from "bcryptjs"
import { UUserService } from '../services/Uuser.service';


const errorService: ErrorService = new ErrorService();
const UuserService: UUserService = new UUserService(errorService, UserQueries);


//const employeeService: EmployeeService = new EmployeeService(errorService);




const getUserById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UuserService.getEntityByIdSP(numericParamOrError)
            .then((result: entityWithId) => {
                return res.status(200).json(result as user);
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

const updateUser = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: user = req.body;
            body.id = numericParamOrError;
            const hashedPassword: string = bcrypt.hashSync(body.password);
            body.password = hashedPassword;
            UuserService.updateEntity(body, (req as AuthenticatedRequest).userData.userId)
            .then((result: user) => {
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

const addUser = async (req: Request, res: Response, next: NextFunction) => {
        
    const body: user = req.body;
    const hashedPassword: string = bcrypt.hashSync(body.password);
    const user: user = {
        id: NON_EXISTENT_ID,
        login: body.login,
        password: hashedPassword,
        role: body.role,
        email: body.email
    };

    UuserService.addEntity(user, (req as AuthenticatedRequest).userData.userId)
        .then((result: entityWithId) => {
            return res.status(200).json(result as user);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UuserService.deleteEntity(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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







export default {getUserById, updateUser, addUser, deleteUser};