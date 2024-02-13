import User from "../modals/User.js"

export async function fetchUserById(req, res) {
     const {id}=req.user;
    
    //Attempts to save the product to the database.
    try {
        const user = await User.findById(id);
        console.log(user);
        res.status(200).json({id:user.id,address:user.address,email:user.email,role:user.role});
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err });
    }
}

export async function UpdateUserProfile(req, res) {
    //Creates a new instance of the Product model using the request body.
    const {id}=req.params;

    //Attempts to save the product to the database.
    try {
        const response = await User.findByIdAndUpdate(id,req.body,{new:true});
        console.log(response);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}
