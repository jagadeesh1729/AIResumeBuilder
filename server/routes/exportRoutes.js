import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { exportDocx, exportPdf } from '../controllers/exportController.js';

const exportRouter = express.Router();

exportRouter.post('/docx', protect, exportDocx);
exportRouter.post('/pdf', protect, exportPdf);

export default exportRouter;

