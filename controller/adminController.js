const { User } = require("../model/user");
const { Product, validateAdminProductForm } = require("../model/product");

const adminProductListRender = async (req, res) => {
  const editId = req.query.editId;
  const users = await User.find({ _id: req.user.user._id }).populate(
    "productList"
  );

  const products = users[0].productList;

  res.render("adminPage.ejs", { products, editId, error: "", cartItems: [], user: req.user, wishlist: [] });
};

const addProductFormSubmit = async (req, res) => {
  const { name, description, price, content } = req.body;
  let pathOfImage = req.file
  const editId = req.query.editId;
  const users = await User.find({ _id: req.user.user._id }).populate("productList");
  const products = users[0].productList;

  const { error } = validateAdminProductForm(req.body);

  if (error) {
    return res.render("adminPage.ejs", {
      error: error.details[0].message,
      products, 
      editId, 
      cartItems: [],
      user: req.user,
      wishlist: []
    }); 
  }
    
  if(pathOfImage == undefined) {
    res.render("adminPage.ejs", { products, editId, error: "Choose a image file to upload", cartItems: [], user: req.user, wishlist: [] });
  }

  const newProduct = await new Product({
    name: name,
    description: description,
    price: price,
    content: content,
    pathOfImage: req.file.filename
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
