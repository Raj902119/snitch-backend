import express from "express";
import { addToCart } from "../controllers/Cart.js";
import { fetchCartByUser } from "../controllers/Cart.js";
import { deleteFromCart } from "../controllers/Cart.js";
import { updateCart } from "../controllers/Cart.js";

const cartRouters = express.Router();

cartRouters.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
    next();
});

cartRouters.get('/',fetchCartByUser)
           .post('/',addToCart)
           .delete('/:id',deleteFromCart)
           .patch('/:id',updateCart);

export default cartRouters ;