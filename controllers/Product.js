import Product from "../modals/Product.js";

//Defines a controller function (createProduct) responsible for handling the creation of a product.
export async function createProduct(req, res) {
    //Creates a new instance of the Product model using the request body.
    const product = new Product(req.body);

    //Attempts to save the product to the database.
    try {
        const response = await product.save();
        console.log(response);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function fetchProductsByFilters(req, res) {
    //Creates a new instance of the Product model using the request body.
    let query = Product.find({deleted:{$ne:true}});
    let totalProducts = Product.find({deleted:{$ne:true}});
    
    if(req.query.category){
        query = query.find({category: req.query.category});
        totalProducts = totalProducts.find({category: req.query.category});
    }
    if(req.query.brand){
        query = query.find({brand: req.query.brand});
        totalProducts = totalProducts.find({brand: req.query.brand});
    }
    if(req.query._sort && req.query._order){
        query = query.sort({[req.query._sort]: req.query._order});
    }
  
    //to count total no of products 
    const totalDocs = await totalProducts.count().exec();
    console.log({totalDocs});

    if(req.query._page && req.query._limit){
        const pageSize = req.query._limit;
        const page = req.query._page;
        query = query.skip(pageSize*(page-1)).limit(pageSize);
    }
    //Attempts to save the product to the database.
    try {
        const response = await query.exec();
        res.set('X-Total-Count',totalDocs);
        console.log(response);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function fetchProductById(req, res) {
    //Creates a new instance of the Product model using the request body.
    const {id} = req.params;
    //Attempts to save the product to the database.
    try {
        const response = await Product.findById(id);
        console.log(response);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function UpdateProduct(req, res) {
    //Creates a new instance of the Product model using the request body.
    const {id} = req.params;
    //Attempts to save the product to the database.
    try {
        const response = await Product.findByIdAndUpdate(id,req.body,{new:true});
        console.log(response);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}