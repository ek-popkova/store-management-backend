import express from 'express';
import controller from '../controllers/user.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';

const router = express.Router();

router.get('/user-by-id/:id', middleware.verifyToken([Role.Administrator]), controller.getUserById);
//router.get('/user-by-id/:id', controller.getUserById);
router.put('/user/:id', middleware.verifyToken([Role.Administrator]), controller.updateUser);
router.post('/user', middleware.verifyToken([Role.Administrator]), controller.addUser);
router.delete('/user/:id', middleware.verifyToken([Role.Administrator]), controller.deleteUser);


export default {router};
