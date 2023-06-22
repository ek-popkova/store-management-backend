import { ErrorService } from '../services/error.service';
import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken"
import { AuthentificationService } from '../services/authentification.service';
import { ResponseHelper } from '../helpers/controller.helper';
import { jwtUserData, systemError, authenticationToken } from '../entities';
import { TOKEN_SECRET } from '../constants';


interface localUser {
    login: string;
    password: string;
}

const errorService: ErrorService = new ErrorService();
const authenticationService : AuthentificationService = new AuthentificationService(errorService);

const login = async (req: Request, res: Response, next: NextFunction) => {

    const user: localUser = req.body;
    authenticationService.login(user.login, user.password)
        .then((userData: jwtUserData) => {
            const authenticationToken: authenticationToken = {
                userData: userData
            };
            const token: string = jwt.sign(
                authenticationToken,
                TOKEN_SECRET,
                {
                    expiresIn: "2h"
                });
            return res.status(200).json({
                token: token
            });
        })
        .catch((error: systemError) => {
            return ResponseHelper.handleError(res, error, true);
        });
    
};

export default {login}