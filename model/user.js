const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: String,
  token: String,
  tokenExpiration: Date,
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
  this.save();
};

const User = mongoose.model("user", userSchema);

module.exports = {
  User,
  validateRegisterForm,
  validateLoginForm,
};
