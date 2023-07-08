const Product = require("../models/ProductsModel");
const multer = require("multer");
const path = require("path");
// controller actions
module.exports.products = async (req, res) => {
  try {
    //fetch all products
    const products = await Product.find();
    console.log(products);
    res.render("store", { products: products });
  } catch (err) {
    res.status(400).json({
      status: "fail",
    });
  }
};

module.exports.allProducts_get = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
    });
  }
};

// multer
// store as original file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/data/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage: storage });

module.exports.uploadFile = upload.single("uploaded_file");

module.exports.product_post = async (req, res) => {
  const { title, description, price, category, quantity } = req.body;
  try {
    const product = await Product.create({
      title,
      description,
      image: "/data/uploads/" + req.file.filename,
      price,
      category,
      quantity,
    });
    res.status(201).json({ product: product._id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

module.exports.getDashboard = async (req, res) => {
  const products = await Product.find();
  res.render("adminDashboard", { products: products });
};

module.exports.product_delete = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json({ product: product._id });
  } catch (err) {
    res.status(400).json({ err });
  }
};

// home
module.exports.home_get = (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      res.redirect("/dashboard");
    } else if (req.user.role === "user") {
      res.redirect("/store");
    }
  } else {
    res.redirect("/login");
  }
};

// buy now
module.exports.buyNow_patch = async (req, res) => {
  const { id, quantity } = req.body;
  try {
    const product = await Product.findById(id);
    if (product.quantity < quantity) {
      res.status(400).json({ err: "Not enough quantity" });
    } else {
      product.quantity -= quantity;
      await product.save({ validateBeforeSave: false });
      res.status(200).json({
        status: "success",
        product: product._id,
      });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};

// update product
module.exports.updateProduct_patch = async (req, res) => {
  const { id, quantity, price, category, description, title } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    product.quantity = quantity;
    product.price = price;
    product.category = category;
    product.description = description;
    product.title = title;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      product: product._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// get single product
module.exports.product_get = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    res.status(200).json({ product });
  } catch (err) {
    res.status(400).json({ err });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
