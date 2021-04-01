require("dotenv").config();

const { Product} = require("../model/product");
const { User } = require("../model/user");

const sortingParams = [
  {
    name: "name (A-Z)",
    value: "name"
  },
  {
    name: "name (Z-A)",
    value: "-name"
  },
  {
    name: "price (low to high)",
    value: "price"
  },
  {
    name: "price (high to low)",
    value: "-price"
  }
];




const loadProducts = async (req, res) => {
  const hidVal = req.body.hidVal;
  //console.log(hidVal);
  let sortedBy = "price";
  let searchText = "";
  let qParams = [];
  let pageIndex = 1;
  let pageSize = 4;
  try {
    
    
    //console.log(req.originalUrl);
    if (req.query.searchText){
      searchText = req.query.searchText;
      qParams.push({name: "searchText", value: searchText});
    }
    if (req.query.pageIndex) {
      pageIndex = Number.parseInt(req.query.pageIndex);
      qParams.push({name: "pageIndex", value: pageIndex});
    }
    if (req.query.sortedBy){
      sortedBy = req.query.sortedBy;
      qParams.push({name: "sortedBy", value: sortedBy});
    }
    var error = null;
    var totalProductCount = 0;
    await Product.countDocuments({}, (err, count) => {
      if (err) {
        error = err;
        return;
      }
      totalProductCount = count;
    });
    var products = await Product.find()
    .sort(sortedBy)
    .limit(pageIndex * pageSize);
  } catch (err) {
    error = err;
  }

  const token = req.cookies.jwtToken;
  if (token) {
    const userData = await User.findOne({
      _id: req.user.user._id,
    }).populate("shoppingCart.productId");

    res.render("index.ejs", {
      products,
      error,
      pageIndex,
      pageSize,
      totalProductCount,
      user:req.user,
      cartItems: userData.shoppingCart,
      sortedBy,
      sortingParams,
      qParams,
      wishlist: userData.wishlist
    });
  } else {
    res.render("index.ejs", {
      products,
      error,
      pageIndex,
      pageSize,
      totalProductCount,
      cartItems: [],
      sortedBy,
      sortingParams,
      qParams,
      wishlist: []
    });
  }
};

module.exports = { loadProducts };
