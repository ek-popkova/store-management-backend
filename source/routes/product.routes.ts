import express from 'express';
import controller from '../controllers/product.controller';
import { Role } from '../enums';
import middleware from '../middleware/auth.middleware';

const router = express.Router();

router.get('/product-by-store/:id', middleware.verifyToken([Role.Administrator]), controller.getAllProductsByStoreId);
router.get('/product-by-id/:id', middleware.verifyToken([Role.Administrator]), controller.getProductById);
router.put('/product/:id', middleware.verifyToken([Role.Administrator]), controller.updateProduct);
router.post('/product', middleware.verifyToken([Role.Administrator]), controller.addProduct);
router.delete('/product/:id', middleware.verifyToken([Role.Administrator]), controller.deleteProduct);


router.post('/location', middleware.verifyToken([Role.Administrator]), controller.addLocation);
router.get('/all-location', middleware.verifyToken([Role.Administrator]), controller.getAllLocations);
router.delete('/location/:id', middleware.verifyToken([Role.Administrator]), controller.deleteLocation);


router.post('/category', middleware.verifyToken([Role.Administrator]), controller.addCategory);
router.get('/all-category', middleware.verifyToken([Role.Administrator]), controller.getAllCategories);
router.delete('/category/:id', middleware.verifyToken([Role.Administrator]), controller.deleteCategory);






export default {router};
