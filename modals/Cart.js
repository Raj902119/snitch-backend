import mongoose from "mongoose";
const { Schema } = mongoose;

//Defines a Mongoose schema for the Product model with various fields.
const CartSchema = new Schema({
    // Define your schema fields here
    quantity: { type : Number, required: true, default:1},
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true},
    user:{ type: Schema.Types.ObjectId, ref: "User", required: true}
});

// Define a virtual field for 'id'
const virtual = CartSchema.virtual('id');
virtual.get(function() {
    return this._id;
});

// Configure the schema to include virtuals in the JSON representation
CartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

//Creates a Mongoose model named 'Cart' based on the schema.
const Cart = mongoose.model('Cart', CartSchema);

//Exports the Product model for use in other parts of the application.
export default Cart;