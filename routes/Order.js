import express from "express";

import { createOrder,fetchOrdersByUser,deleteOrder,updateOrder,fetchAllOrders } from "../controllers/Order.js";

const orderRouters = express.Router();

orderRouters.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
    next();
});

orderRouters.post('/', createOrder)
            .get('/own/', fetchOrdersByUser)
            .delete('/:id', deleteOrder)
            .patch('/:id', updateOrder)
            .get('/',fetchAllOrders);

export default orderRouters;            