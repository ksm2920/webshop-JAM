const {User} = require('../model/user');
const bcrypt = require('bcrypt');

const loginRender = (req, res) => {
    res.render('login.ejs', {error:""})
}

const loginSubmit = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email:email});
    const validUser = await bcrypt.compare(password, user.password);

    console.log(validUser);

    //redirect to shopping cart
    res.redirect('/');
}

module.exports = {
    loginRender,
    loginSubmit
}
