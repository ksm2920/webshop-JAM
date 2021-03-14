const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: { type:String, required: true},
    email: { type:String, required: true, unique: true },
    password: { type: String, required: true},
    role: String,
    token: String,
    tokenExpiration: Date,
    productList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ],
    shoppingCart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "prodcut"
        }
    ]
})

function validateRegisterForm(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        email: Joi.string().min(5).max(200).required().email(),
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(user);
}

function validateLoginForm(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(200).required().email(),
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(user);
}

userSchema.methods.addProductList = function(productId) {
    this.productList.push(productId);
    this.save();
}

userSchema.methods.removeProduct = function(productId) {
    this.productList = this.productList.filter( product => product._id != productId);
    this.save();
}

userSchema.methods.addToCart = function(productId) {
    this.shoppingCart.push(productId);
    this.save();
}



const User = mongoose.model('user', userSchema);

module.exports = {
    User,
    validateRegisterForm,
    validateLoginForm  
};