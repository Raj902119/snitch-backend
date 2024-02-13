import express from 'express';
import { fetchAllCategories } from '../controllers/Category.js';
import { createCategory } from '../controllers/Category.js';

const categoryRouters = express.Router();

categoryRouters.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
    next();
});

categoryRouters.get('/',fetchAllCategories).post('/',createCategory);

export default categoryRouters ;