import { Queries } from "../constants";
import { entityWithId, jwtUserData, systemError } from "../entities";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";
import bcrypt from "bcryptjs"
import { AppError, Role } from "../enums";

interface localUser extends entityWithId {
    password: string;
    role_id: Role[];
}

interface localRole {
    role_id: number;
}

interface IAuthentificationService {
    login(login: string, password: string): Promise<jwtUserData>;
}

export class AuthentificationService implements IAuthentificationService {

    constructor(
        private errorService: ErrorService
    ) {}

    public login(login: string, password: string): Promise<jwtUserData> {
        return new Promise<jwtUserData>((resolve, reject) => {
            SqlHelper.executeQuerySingleResult<localUser>(this.errorService, Queries.GetUserByLogin, login)
            .then((user: localUser) => {
                if (bcrypt.compareSync(password, user.password)) {
                    SqlHelper.executeQueryArrayResult<localRole>(this.errorService, Queries.GetRolesByUserId, user.id)
                    .then((roles: localRole[]) => {
                        const role_number: number[] = []
                        roles.forEach((entity: localRole) => {
                            role_number.push(entity.role_id);
                        })
                        const result: jwtUserData = {
                            userId: user.id,
                            roleID: role_number
                        };
                        resolve(result);
                    })
                    .catch((error: systemError) => {
                        reject(error)
                    })
                }
                else {
                    reject(this.errorService.getError(AppError.NoDataFound));
                }
                })
                .catch((error: systemError) => {
                  reject(error)
                })

        });
    }
}