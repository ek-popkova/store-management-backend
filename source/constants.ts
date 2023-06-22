import { QueryString } from "./entities";

export class ErrorCodes {
    public static GeneralError: number = 99;
    public static ConnectionError: number = 100;
    public static QueryError: number = 101;
    public static NoDataFound: number = 102;
    public static NonNumericInput: number = 103;
    public static InputParametrsNotSupplied: number = 104;
    public static DeletionConflict: number = 105;

}

export class ErrorMessages {
    public static GeneralError: string = "General Error. Debug me!";
    public static DbConnectionError: string = "DB server connection error";
    public static SqlQueryError: string = "Incorrect query";
    public static NoDataFound: string = "No data found";
    public static NonNumericInput: string = "Non numeric input suplied";
    public static InputParametrsNotSupplied: string = "Input parametrs are not supplied";
    public static DeletionConflict: string = "Deletion is not possible due to refferenced record";

}

export class SqlParametrs {
    public static Id: string = "id";

}

export class Queries {
    public static getAllStores: string = `SELECT s.id, s.address, s.area, s.category_id, sc.category_name 
    FROM store s
    INNER JOIN store_category sc
    ON sc.id = s.category_id WHERE status_id = ?`;
    public static getStoreById: string = `SELECT s.id, s.address, s.area, s.category_id, sc.category_name 
    FROM store s
    INNER JOIN store_category sc 
    ON sc.id = s.category_id 
    WHERE s.id = ? AND status_id = ?`;
    public static updateStore: string = "UPDATE store SET [address] = ?, area = ?, category_id = ?, update_date = ?, update_user_id = ? WHERE id = ? AND status_id = ?";  
    public static deleteStore: string = "UPDATE store SET update_date = ?, update_user_id = ?, status_id = ? WHERE id = ? AND status_id = ?";

    public static getAllEmployeesByStoreId: string = `SELECT e.id, e.first_name, e.last_name, e.birthdate, e.email, e.telephone, e.job_title_id, e.status_id, jt.job_name, s.address,
    CASE e.is_male
    WHEN 0 THEN 'Female'
    ELSE 'Male'
    END as gender
    FROM employee e
        INNER JOIN store s ON e.store_id = s.id
        INNER JOIN job_title jt ON e.job_title_id = jt.id
        WHERE e.store_id = ? AND e.status_id = ?`;
    public static getEmployeeById: string = `SELECT e.id, e.first_name, e.last_name, e.birthdate, e.email, e.telephone, e.job_title_id, e.status_id, jt.job_name, s.address,
    CASE e.is_male
    WHEN 0 THEN 'Female'
    ELSE 'Male'
    END as gender
    FROM employee e
    INNER JOIN job_title jt ON e.job_title_id = jt.id
	INNER JOIN store s ON e.store_id = s.id
    WHERE e.id = ? AND e.status_id = ?`;

    public static GetUserByLogin: string = "SELECT id, password FROM [user] WHERE login = ?";
    public static GetRolesByUserId: string = "SELECT role_id FROM user_to_role WHERE user_id = ?";
    
}

export class StoredProcedures {
    public static addStore: string = "sp_create_store";

    public static updateEmployee: string = "sp_update_employee";
    public static addEmployee: string = "sp_create_employee";
    public static deleteEmployee: string = "sp_delete_employee";

    public static addRelation: string = "sp_add_relation";
    public static deleteRelation: string = "sp_delete_relation";

}

export const DB_CONNECTION_STRING: string = "server=.;Database=masa_store;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
export const NON_EXISTENT_ID: number = -1;
export const NON_EXISTENT_CATEGORY: string = "";
export const TEMP_USER_ID: number = 2;
export const TOKEN_SECRET: string = "c7e07763-fd6d-460f-bbe8-a24f4a4c11b5";

export const FAKE_STRING: string = "NO_SP"

export const EmployeeQueries: QueryString = {
    getAllSP: FAKE_STRING,
    getByGeneralIdSP: "sp_get_employee_by_store_id",
    getByIdSP: "sp_get_employee",
    updateSP: "sp_update_employee",
    addSP: "sp_create_employee",
    deleteSP: "sp_delete_employee"
}

export const UserQueries: QueryString = {
    getAllSP: FAKE_STRING,
    getByGeneralIdSP: FAKE_STRING,
    getByIdSP: "sp_get_user",
    updateSP: "sp_update_user",
    addSP: "sp_create_user",
    deleteSP: "sp_delete_user"
}

export const ProductQueries: QueryString = {
    getAllSP: FAKE_STRING,
    getByGeneralIdSP: "sp_get_product_by_store_id",
    getByIdSP: "sp_get_product",
    updateSP: "sp_update_product",
    addSP: "sp_create_product",
    deleteSP: "sp_delete_product"
}

export const CategoryQueries: QueryString = {
    getAllSP: "sp_get_all_category",
    getByGeneralIdSP: FAKE_STRING,
    getByIdSP: FAKE_STRING,
    updateSP: FAKE_STRING,
    addSP: "sp_create_product_category",
    deleteSP: "sp_delete_product_category"
}

export const LocationQueries: QueryString = {
    getAllSP: "sp_get_all_location",
    getByGeneralIdSP: FAKE_STRING,
    getByIdSP: FAKE_STRING,
    updateSP: FAKE_STRING,
    addSP: "sp_create_location",
    deleteSP: "sp_delete_location"
}

export const PositionQueries: QueryString = {
    getAllSP: "sp_get_all_position",
    getByGeneralIdSP: FAKE_STRING,
    getByIdSP: FAKE_STRING,
    updateSP: FAKE_STRING,
    addSP: FAKE_STRING,
    deleteSP: FAKE_STRING
}

