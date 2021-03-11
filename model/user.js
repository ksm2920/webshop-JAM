const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: { type:String, required: true, unique: true },
  email: { type:String, required: true, unique: true },
  password: { type: String, required: true},
  role: String,
  token: String,
  tokenExpiration: Date
})

function validateUserForm(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        email: Joi.string().min(5).max(200).required().email(),
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(user);
}

const User = mongoose.model('user', userSchema);

module.exports = {
    User,
    validateUserForm
};