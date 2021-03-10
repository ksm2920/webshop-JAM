const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoute');

const nodeSass = require('node-sass-middleware');
require('dotenv').config();

const app = express();

app.use(nodeSass({
    src: __dirname + "/scss",                
    dest: __dirname + "/public",       
    debug: true,
    outputStyle: 'compressed'
}), express.static(__dirname + "/public"))

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.use(cookieParser());

app.use('/', userRouter);

const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

mongoose.connect(
    process.env.DB_CONNECTION,
    option,
    (err) => {
        console.log(err);
        
        if(err) {
            console.log("Error" + err);
            return;
        }
        console.log("Database is connected");
        
        app.listen(process.env.PORT|| 8000, () => {
            console.log("Application is running too");
        })
    })