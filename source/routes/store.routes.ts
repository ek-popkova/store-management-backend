import express from 'express';
import controller from '../controllers/store.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';

const router = express.Router();

//router.get('/stores', middleware.verifyToken([Role.Administrator]), controller.getAllStores);
router.get('/stores', controller.getAllStores);
router.get('/store/:id', middleware.verifyToken([Role.Administrator]), controller.getStoreById);
router.put('/store/:id', middleware.verifyToken([Role.Administrator]), controller.updateStore);
router.post('/store', middleware.verifyToken([Role.Administrator]), controller.addStore);
router.delete('/store/:id', middleware.verifyToken([Role.Administrator]), controller.deleteStoreById);

export default {router};
