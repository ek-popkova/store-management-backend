import { Request, Response, NextFunction } from 'express';
import { NON_EXISTENT_CATEGORY, NON_EXISTENT_ID, TEMP_USER_ID } from '../constants';
import { AuthenticatedRequest, store, systemError } from '../entities';
import { ResponseHelper } from '../helpers/controller.helper';
import { RequestHelper } from '../helpers/request.helper';
import { ErrorService } from '../services/error.service';
import { StoreService } from '../services/store.service';


const errorService: ErrorService = new ErrorService();
const storeService: StoreService = new StoreService(errorService);

const getAllStores = async (req: Request, res: Response, next: NextFunction) => {
    storeService.getAllStores()
        .then((result: store[]) => {
            return res.status(200).json({
                stores: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const getStoreById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            storeService.getStoreById(numericParamOrError)
            .then((result: store) => {
                return res.status(200).json(result);
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

const updateStore = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: store = req.body;
            body.id = numericParamOrError;
            storeService.updateStore(body, (req as AuthenticatedRequest).userData.userId)
            .then((result: store) => {
                return res.status(200).json({
                    UPDvalues: result
                });
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

const addStore = async (req: Request, res: Response, next: NextFunction) => {
        
    const body: store = req.body;
    const store: store = {
        id: NON_EXISTENT_ID,
        address: body.address,
        area: body.area,
        category_name: body.category_name
    };

    storeService.addStore(store, (req as AuthenticatedRequest).userData.userId)
        .then((result: store) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const deleteStoreById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            storeService.deleteStoreById(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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


export default {getAllStores, getStoreById, updateStore, addStore, deleteStoreById};