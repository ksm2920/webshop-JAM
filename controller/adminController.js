const {User} = require('../model/user');
const Product = require('../model/product');

const addProductForm = (req, res) => {
    res.render('productForm.ejs', {error:""});
}

const addProductFormSubmit = async (req, res) => {
    const {name, description, price} = req.body;
    const pathOfImage = req.file.filename;
   
    const newProduct = await new Product(
        {   name:name, 
            description:description, 
            price:price, 
            pathOfImage:pathOfImage
        });

    console.log(newProduct);

    newProduct.save();

    const user = await User.findOne({_id:req.user.user._id});

    console.log(user);

    user.addProductList(newProduct._id);
    res.redirect('/adminPage');

}

const showAdminProductList = async (req, res) => {
    const user = await User.find({_id:req.user.user._id}).populate('productList');
    res.render('adminPage.ejs', {product: user.productList, error:""})
}

module.exports = {
    addProductForm,
    addProductFormSubmit,
    showAdminProductList
}
