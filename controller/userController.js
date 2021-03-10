const User = require('../model/user');

const testRender = (req, res) => {
    res.render('index.ejs');
}

const testSubmit = (req,res) => {

    const newUser = new User ({
        name: req.body.name
    });
    console.log(newUser);
    
    newUser.save();

    res.send("It works as well");
}

module.exports = {testRender, testSubmit};