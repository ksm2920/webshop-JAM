const { User } = require("../model/user");
const Product = require("../model/product");

const adminProductListRender = async (req, res) => {
  const editId = req.query.editId;
  const users = await User.find({ _id: req.user.user._id }).populate(
    "productList"
  );

  console.log(users[0].productList);

  const products = users[0].productList;

  res.render("adminPage.ejs", { products, editId, error: "", cartItems: null, user: req.user });
};

const addProductFormSubmit = async (req, res) => {
  const { name, description, price, content } = req.body;
  const pathOfImage = req.file.filename;

  const newProduct = await new Product({
    name: name,
    description: description,
    price: price,
    content: content,
    pathOfImage: pathOfImage,
  });

  //console.log(newProduct);

  newProduct.save();

  const user = await User.findOne({ _id: req.user.user._id });

  //console.log(user);

  user.addProductList(newProduct._id);
  res.redirect("/adminPage");
};

const editProductFormSubmit = async (req, res) => {
  const id = req.params.id;
  const { name, description, price, content } = req.body;

  //console.log(req.body);
  //console.log(id);
  await Product.findByIdAndUpdate(
    id,
    { name: name, description: description, price: price, content: content },
    () => {
      res.redirect("/adminPage");
    }
  );
};

const removeProductFromList = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: req.user.user._id });
  user.removeProduct(id);

  await Product.findByIdAndRemove(id, { name: req.body.name }, () => {
    res.redirect("/adminPage");
  });
};

module.exports = {
  adminProductListRender,
  addProductFormSubmit,
  editProductFormSubmit,
  removeProductFromList,
};
