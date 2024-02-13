import mongoose from "mongoose";
const { Schema } = mongoose;

//Defines a Mongoose schema for the Product model with various fields.
const orderSchema = new Schema({
    // Define your schema fields here
    items: { type: [Schema.Types.Mixed], required: true },
    TotalSum: { type: Number },
    TotalQua: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    //TODO:  we can add enum types
    paymentMethod: { type: String, required: true },
    Status: { type: String, default: 'pending' },
    SelectAdd: { type: Schema.Types.Mixed, required: true },
});

// Define a virtual field for 'id'
const virtual = orderSchema.virtual('id');
virtual.get(function() {
    return this._id;
});

// Configure the schema to include virtuals in the JSON representation
orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

//Creates a Mongoose model named 'User' based on the schema.
const Order = mongoose.model('Order', orderSchema);

//Exports the Product model for use in other parts of the application.
export default Order;