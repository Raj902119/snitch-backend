import mongoose from "mongoose";
const { Schema } = mongoose;

//Defines a Mongoose schema for the Product model with various fields.
const UserSchema = new Schema({
    // Define your schema fields here
    email: { type: String, required: true },
    password: { type: Buffer, required: true },
    role: { type: String, required: true,default:"user" },
    address: { type: [Schema.Types.Mixed]},
    //we can do seperate schema for address
    // Add more fields as needed
    name:{type:String},
    salt:{type:Buffer},
});

// Define a virtual field for 'id'
const virtual = UserSchema.virtual('id');
virtual.get(function() {
    return this._id;
});

// Configure the schema to include virtuals in the JSON representation
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

//Creates a Mongoose model named 'User' based on the schema.
const User = mongoose.model('User', UserSchema);

//Exports the Product model for use in other parts of the application.
export default User;