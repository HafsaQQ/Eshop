const { Router } = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/", productController.home_get);

router.get(
  "/store",
  requireAuth,
  authController.restrictTo("user"),
  productController.products
);

router.route("/products").get(requireAuth, productController.allProducts_get);

router.post(
  "/product",
  requireAuth,
  productController.uploadFile,
  productController.product_post
);

router.delete("/product/:id", requireAuth, productController.product_delete);
router.patch(
  "/product/:id",
  requireAuth,
  productController.updateProduct_patch
);
router.get("/product/:id", requireAuth, productController.product_get);

router.get(
  "/dashboard",
  requireAuth,
  authController.restrictTo("admin"),
  productController.getDashboard
);

router.patch("/buy", productController.buyNow_patch);

module.exports = router;
