import mongoose from "mongoose";
const { Schema } = mongoose;

//Defines a Mongoose schema for the Product model with various fields.
const productSchema = new Schema({
    // Define your schema fields here
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, min: [1, 'wrong min price'], max: [1000, 'wrong max price'], required: true },
    rating: { type: Number, min: [0, 'wrong min price'], max: [5, 'wrong max price'], required: true },
    stock: { type: Number, min: [0, 'wrong min price'], required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    deleted: { type: Boolean, required: false },
    // Add more fields as needed
});

// Define a virtual field for 'id'
const virtual = productSchema.virtual('id');
virtual.get(function() {
    return this._id;
});

// Configure the schema to include virtuals in the JSON representation
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

//Creates a Mongoose model named 'Product' based on the schema.
const Product = mongoose.model('Product', productSchema);

//Exports the Product model for use in other parts of the application.
export default Product;