import mongoose from "mongoose";
const { Schema } = mongoose;

//Defines a Mongoose schema for the Product model with various fields.
const BrandSchema = new Schema({
    // Define your schema fields here
    value: { type: String, required: true },
    label: { type: String, required: true },
    // Add more fields as needed
    
});

// Define a virtual field for 'id'
const virtual = BrandSchema.virtual('id');
virtual.get(function() {
    return this._id;
});

// Configure the schema to include virtuals in the JSON representation
BrandSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

//Creates a Mongoose model named 'CATEGORY' based on the schema.
const Brand = mongoose.model('Brand', BrandSchema);

//Exports the Product model for use in other parts of the application.
export default Brand;