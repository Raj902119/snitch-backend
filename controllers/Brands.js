import Brand from "../modals/Brands.js";

export async function fetchAllBrands(req, res) {

    //Attempts to save the product to the database.
    try {
        const brands = await Brand.find({}).exec();
        console.log(brands);
        res.status(201).json(brands);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function createBrands(req, res) {
    //Creates a new instance of the Product model using the request body.
    const brands = new Brand(req.body);

    //Attempts to save the product to the database.
    try {
        const response = await brands.save();
        console.log(response);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}
