const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String, require: true},
    price: {type: Number, require: true},
    content: {type: String, require: true},
    pathOfImage:{type: String, require:true}
})

const Product = mongoose.model('product', productSchema);

module.exports = Product;