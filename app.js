const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const indexRouter = require("./routes/indexRoute");
const productRouter = require("./routes/productRoute");
const cartRouter = require("./routes/cartRoute");
const checkoutRouter = require("./routes/checkoutRoute");

const nodeSass = require("node-sass-middleware");
require("dotenv").config();

const app = express();

app.use(
  nodeSass({
    src: __dirname + "/scss",
    dest: __dirname + "/public",
    debug: true,
    outputStyle: "compressed",
  }),
  express.static(__dirname + "/public")
);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", productRouter);
app.use("/", cartRouter);
app.use("/", checkoutRouter);

const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(process.env.DB_CONNECTION, option, (err) => {
  if (err) {
    console.log("Error" + err);
    return;
  }
  console.log("Database is connected");

  app.listen(process.env.PORT || 8000, () => {
    console.log("Application is running too");
  });
});
