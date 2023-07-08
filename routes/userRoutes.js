const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/store", productController.products);

module.exports = router;
