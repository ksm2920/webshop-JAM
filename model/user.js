const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: String,
  token: String,
  tokenExpiration: Date,
  address: String,
  city: String,
  zipcode: Number,
  phone: Number,
  productList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  shoppingCart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  wishlist: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    },
  ],
});

function validateRegisterForm(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().min(5).max(200).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(user);
}

function validateLoginForm(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(200).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(user);
}

function validateCheckoutForm(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    lastname: Joi.string().min(2).max(30).required(),
    address: Joi.string().min(5).max(255).required(),
    city: Joi.string().min(5).max(255).required(),
    zip: Joi.number().min(00001).max(99999).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phone: Joi.number().min(0000000001).max(9999999999).required(),
  });
  return schema.validate(user);
}

userSchema.methods.addProductList = function(productId) {
  this.productList.push(productId);
  this.save();
}

userSchema.methods.addToCart = function (productId) {
  const foundItem = this.shoppingCart.find(
    (product) => product.productId == productId
  );

  !foundItem
    ? this.shoppingCart.push({
        productId: productId,
        quantity: 1,
      })
    : foundItem.quantity++;

  return this.save();
};

userSchema.methods.decreaseProduct = function (productId) {
  const foundItem = this.shoppingCart.find(
    (product) => product.productId == productId
  );

  foundItem.quantity--;

  if (foundItem.quantity === 0) {
    this.shoppingCart = this.shoppingCart.filter(
      (product) => product.productId != productId
    );
    this.save();
  }

  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  this.shoppingCart = this.shoppingCart.filter(
    (product) => product.productId != productId
  );
  return this.save();
};

userSchema.methods.removeProduct = function (productId) {
  this.productList = this.productList.filter(
    (product) => product._id != productId
  );
  return this.save();
};

const User = mongoose.model("user", userSchema);

module.exports = {
  User,
  validateRegisterForm,
  validateLoginForm,
  validateCheckoutForm,
};
