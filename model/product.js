const Joi = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    content: {type: String, required: true},
    pathOfImage:{type: String, required:true}
})

function validateAdminProductForm(product) {
    const schema = Joi.object({
      name: Joi.string().min(2).max(30).required(),
      description: Joi.string().min(2).max(200).required(),
      price: Joi.number().min(1).max(9999).required(),
      content: Joi.string().min(2).max(200).required(),
      pathOfImage: Joi.string().min(1).required().messages({'any.required': "Choose a image file to upload"})
    });
    return schema.validate(product);
  }

const Product = mongoose.model('product', productSchema);

module.exports = { 
    Product,
    validateAdminProductForm 
}