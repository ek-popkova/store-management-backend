/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';

const getHelloWorld = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "Hello world!"
    });
};

const getWithTimeout = async (req: Request, res: Response, next: NextFunction) => {
    setTimeout(() => {
        return res.status(200).json({
            message: "Timeout in 1 second"
        });
    }, 1000);
    
};

const getWithDelay = async (req: Request, res: Response, next: NextFunction) => {
    //Read the delay in seconds from mrequest parametr
    let delayInSeconds: number = parseInt(req.params.seconds);

    setTimeout(() => {
        return res.status(200).json({
            message: `Timeout in ${delayInSeconds} second(s)`
        });
    }, delayInSeconds * 1000);
    
};

const getWithDelayValidated = async (req: Request, res: Response, next: NextFunction) => {
    //Read the delay in seconds from mrequest parametr
    const secondsStringParameter: string = req.params.seconds;

    if (isNaN(Number(secondsStringParameter))) {
        //error response with an error message (old approach)
        // return res.status(406).json({ //the error-codes are in the internet, U can choose
        //     error: "Incorrect seconds parameter value"
        // });

        // error response without a message
        return res.sendStatus(406);


    }
    else {
        //all is good, proceed
        let delayInSeconds: number = parseInt(secondsStringParameter);
        setTimeout(() => {
            return res.status(200).json({
                message: `Timeout in ${delayInSeconds} second(s)`
            });
        }, delayInSeconds * 1000);
    }
};


export default {getHelloWorld, getWithTimeout, getWithDelay, getWithDelayValidated};