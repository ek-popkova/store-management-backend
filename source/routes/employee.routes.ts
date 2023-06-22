import express from 'express';
import controller from '../controllers/employee.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';

const router = express.Router();

router.get('/employee-by-store/:id', middleware.verifyToken([Role.Administrator]), controller.getAllEmployeesByStoreId);
router.get('/employee-by-id/:id', middleware.verifyToken([Role.Administrator]), controller.getEmployeeById);
//router.get('/employee-by-id/:id', controller.getEmployeeById);
router.put('/employee/:id', middleware.verifyToken([Role.Administrator]), controller.updateEmployee);
router.post('/employee', middleware.verifyToken([Role.Administrator]), controller.addEmployee);
router.delete('/employee/:id', middleware.verifyToken([Role.Administrator]), controller.deleteEmployee);

router.post('/employee-relation', middleware.verifyToken([Role.Administrator]), controller.addRelation);
router.delete('/employee-relation', middleware.verifyToken([Role.Administrator]), controller.deleteRelation);

router.get('/positions', middleware.verifyToken([Role.Administrator]), controller.getAllPositions);





export default {router};
