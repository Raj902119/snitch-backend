import mongoose from "mongoose";
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    // Define your schema fields here
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    // Add more fields as needed
    
});

// Define a virtual field for 'id'
const virtual = PaymentSchema.virtual('id');
virtual.get(function() {
    return this._id;
});

// Configure the schema to include virtuals in the JSON representation
PaymentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

//Creates a Mongoose model named 'CATEGORY' based on the schema.
const Payment = mongoose.model('Payment', PaymentSchema);

//Exports the Product model for use in other parts of the application.
export default Payment;