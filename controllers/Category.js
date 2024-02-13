import Category from "../modals/Category.js";

export async function fetchAllCategories(req, res) {

    //Attempts to save the product to the database.
    try {
        const category = await Category.find({}).exec();
        console.log(category);
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function createCategory(req, res) {
    //Creates a new instance of the Product model using the request body.
    const category = new Category(req.body);

    //Attempts to save the product to the database.
    try {
        const response = await category.save();
        console.log(response);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}
