import express from 'express';
import { createProduct } from '../controllers/Product.js';
import { fetchProductById } from '../controllers/Product.js';
import { fetchProductsByFilters } from '../controllers/Product.js';
import { UpdateProduct } from '../controllers/Product.js';
const productRouters = express.Router();

productRouters.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
    next();
});

productRouters.post('/',createProduct)
              .get("/",fetchProductsByFilters)
              .get('/:id',fetchProductById)
              .patch('/:id',UpdateProduct);

export default productRouters ;