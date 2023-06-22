import jwt, {JwtPayload} from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { TOKEN_SECRET } from "../constants";
import { AuthenticatedRequest, jwtUserData } from "../entities";
import { Role } from "../enums";


interface jwtBase {
    userData: jwtUserData;
    exp: number;
    iat: number;
}

const verifyToken = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined = req.headers["authorization"]?.toString();

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    token = token.substring("Bearer ".length);
    const decoded: string | JwtPayload = jwt.verify(token, TOKEN_SECRET);
    let intersection: Role[] = (decoded as jwtBase).userData.roleID.filter(x => roles.includes(x));
    // if (roles.indexOf((decoded as jwtBase).userData.roleID) === -1) {
    //   return res.sendStatus(401);
    // }
    if (intersection.length === 0) {
          return res.sendStatus(401);
    }
    //console.log(decoded);
    (req as AuthenticatedRequest).userData = (decoded as jwtBase).userData;

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

export default {verifyToken};