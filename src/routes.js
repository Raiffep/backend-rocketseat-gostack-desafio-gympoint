import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import AdminController from './app/controllers/AdminController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import MatriculationController from './app/controllers/MatriculationController';

import authMiddleware from './app/middlewares/auth';
import Matriculation from './app/models/Matriculation';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.get('/users', UserController.showAll);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.delete('/users', UserController.delete);

routes.get('/admins', AdminController.index);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.showAll);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.showAll);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/matriculations', MatriculationController.store);
routes.get('/matriculations', MatriculationController.index);

export default routes;
