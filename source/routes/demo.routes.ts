import express from 'express';
import controller from '../controllers/demo.controller';

const router = express.Router();
//express is a server (object) that knows how to send requests (local one)

//не выделяет ошибкой, если 2 одинаковых, эти файлы должны быть маленькие, чтобы можно было видеть глазами

router.get('/hello-world', controller.getHelloWorld);
router.get('/timeout', controller.getWithTimeout);
router.get('/delay/:seconds', controller.getWithDelay);
router.get('/delay-validated/:seconds', controller.getWithDelayValidated);

//creates an alias to a file
export default {router};

//export = router; - exports the whole file