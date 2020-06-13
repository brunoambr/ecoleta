import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';

const routes = express.Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

// #region GET

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

// #endregion

// #region POST

routes.post('/points', upload.single('image'), pointsController.create); // upload.single('image') faz o upload do campo image na pasta uploads, dadas as configurações do mutler

// #endregion

export default routes;