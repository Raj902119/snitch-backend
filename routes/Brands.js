import express from "express";

import { fetchAllBrands } from "../controllers/Brands.js";
import { createBrands } from "../controllers/Brands.js";

const brandRouters = express.Router();

brandRouters.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
    next();
});

brandRouters.get('/',fetchAllBrands).post('/',createBrands);

export default brandRouters ;