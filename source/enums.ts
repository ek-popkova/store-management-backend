export enum Status {
    Active = 1,
    NotActive = 2
}

export enum AppError {
    General = "General",
    ConnectionError = "ConnectionError",
    QueryError = "QueryError",
    NoDataFound = "NoDataFound",
    NonNumericInput = "NonNumericInput",
    InputParametrsNotSupplied = "InputParametrsNotSupplied",
    DeletionConflict = "DeletionConflict",
    SPNotProvided = "SPError"
}

export enum Role {
    Administrator = 2,
    RegularUser = 3
}

export enum Gender {
    Male = 'Male',
    Female = 'Female'
}
