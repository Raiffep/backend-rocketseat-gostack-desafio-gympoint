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
import HelpOrderController from './app/controllers/HelpOrdersController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/students/:id/checkins', StudentController.checkin);
routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.index);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/plans', PlanController.index);

routes.post('/matriculations', MatriculationController.store);
routes.get('/matriculations', MatriculationController.index);

routes.put('/help-orders/:id/answer', HelpOrderController.update);

routes.use(adminMiddleware);

routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.delete('/users', UserController.delete);

routes.get('/admins', AdminController.index);

routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

export default routes;
