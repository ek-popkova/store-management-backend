# :department_store: Store Management Web Application Backend

This repository contains the backend implementation of a web application designed for managing a store. It provides access to various resources such as stores, products, product quantities, store locations, employees with their details, job roles, and implements authentication and authorization functionalities.

This project serves as a playground for practicing backend technologies.

## :hammer_and_wrench: Technologies and tools used

- Node.js
- TypeScript
- Express
- MSSQL (Microsoft SQL Server) for the database
- Postman

## :building_construction: Project Structure

The project follows a structured approach to ensure maintainability and scalability. Here is an overview of the main components:

<img src="https://github.com/ek-popkova/store-management-backend/assets/111788752/800dc480-f04c-4a89-9c90-635b769dbf5e" alt="structure" style="width: 700px;">


1. **Middleware**: The middleware is responsible for managing the authentication process, ensuring secure access to the application's resources.
2. **Controllers**: Controllers are used to handle incoming requests, route them to the appropriate services, and manage the overall flow of data within the backend application.
3. **Services**: The core business logic is implemented within the services. Most of the services inherit from an abstract class called "UniversalService." This abstract class provides common functionality and defines abstract methods that must be implemented by the derived services. The services use stored procedures to interact with the database. The "StoreService" and "AuthenticationService" use parametrized queries for their specific requirements. This division was implemented to practice both approaches and maintain code modularity.
4. **Helpers**: Helpers are utilized to provide reusable functions and utility methods that assist in performing common tasks within the backend application, promoting code reusability and maintainability.

## :rocket: Main Features and Overview

The backend utilizes MSSQL as the underlying database technology. 

<img src="https://github.com/ek-popkova/store-management-backend/assets/111788752/f7c2a022-dcdc-4b82-95eb-6ca9a05b2a7f" alt="database" style="width: 700px;">

Most of the CRUD (Create, Read, Update, Delete) operations are performed using stored procedures with transactions. However, some CRUD operations utilize parametrized queries.

<img src="https://github.com/ek-popkova/store-management-backend/assets/111788752/4aca9780-97bc-4e66-8066-0324f28eb24d" alt="procedures" style="width: 700px;">


All CRUD operations have been thoroughly tested using Postman, ensuring the reliability and correctness of the API endpoints.

Example of authentication process:

<img src="https://github.com/ek-popkova/store-management-backend/assets/111788752/1cea0d22-ff04-4d34-85d7-017734980f6d" alt="postman_ex1" style="width: 700px;">

Example of request:

<img src="https://github.com/ek-popkova/store-management-backend/assets/111788752/71aed1ca-8907-4ab3-9511-d31d284c076c" alt="postman_ex2" style="width: 700px;">


