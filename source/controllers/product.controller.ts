import { Request, Response, NextFunction } from 'express';
import { ProductQueries, NON_EXISTENT_ID, CategoryQueries, LocationQueries} from '../constants';
import { AuthenticatedRequest, employee, entityWithId, entityWithName, product, systemError } from '../entities';
import { ResponseHelper } from '../helpers/controller.helper';
import { RequestHelper } from '../helpers/request.helper';
import { ErrorService } from '../services/error.service';
import { UCategoryService } from '../services/Ucategory.service';
import { ULocationService } from '../services/Ulocation.service';
import { UProductService } from '../services/Uproduct.service';



const errorService: ErrorService = new ErrorService();
const UproductService: UProductService = new UProductService(errorService, ProductQueries);
const UcategoryService: UCategoryService = new UCategoryService(errorService, CategoryQueries);
const UlocationService: ULocationService = new ULocationService(errorService, LocationQueries);


const getAllProductsByStoreId = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UproductService.getAllByGeneralId(numericParamOrError)
            .then((result: product[]) => {
                return res.status(200).json({
                    products: result
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


const getProductById = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UproductService.getEntityByIdSP(numericParamOrError)
            .then((result: entityWithId) => {
                return res.status(200).json(result as product);
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

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: product = req.body;
            body.id = numericParamOrError;
            UproductService.updateEntity(body, (req as AuthenticatedRequest).userData.userId)
            .then((result: product) => {
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

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
        
    const body: product = req.body;
    const product: product = {
        id: NON_EXISTENT_ID,
        vendor_code: body.vendor_code,
        name: body.name,
        price: body.price,
        category: body.category,
        location: body.location
    };

    UproductService.addEntity(product, (req as AuthenticatedRequest).userData.userId)
        .then((result: entityWithId) => {
            return res.status(200).json(result as product);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UproductService.deleteEntity(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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

const addCategory = async (req: Request, res: Response, next: NextFunction) => {
        
    const body: entityWithName = req.body;
    const category: entityWithName = {
        id: NON_EXISTENT_ID,
        name: body.name
    }
    UcategoryService.addEntity(category, (req as AuthenticatedRequest).userData.userId)
        .then((result: entityWithId) => {
            return res.status(200).json(result as entityWithName);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const addLocation = async (req: Request, res: Response, next: NextFunction) => {
        
    const body: entityWithName = req.body;
    const location: entityWithName = {
        id: NON_EXISTENT_ID,
        name: body.name
    }
    UlocationService.addEntity(location, (req as AuthenticatedRequest).userData.userId)
        .then((result: entityWithId) => {
            return res.status(200).json(result as entityWithName);
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};


const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {

    UcategoryService.getAll()
        .then((result: entityWithName[]) => {
            return res.status(200).json({
                categories: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const getAllLocations = async (req: Request, res: Response, next: NextFunction) => {

    UlocationService.getAll()
        .then((result: entityWithName[]) => {
            return res.status(200).json({
                locations: result
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error);
        })
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UcategoryService.deleteEntity(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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

const deleteLocation = async (req: Request, res: Response, next: NextFunction) => {

    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(errorService, req.params.id);
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            UlocationService.deleteEntity(numericParamOrError, (req as AuthenticatedRequest).userData.userId)
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

export default {getAllProductsByStoreId, getProductById, updateProduct, addProduct, deleteProduct, addCategory, addLocation, getAllCategories, getAllLocations, deleteCategory, deleteLocation};