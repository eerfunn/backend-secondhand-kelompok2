const express = require("express");
const handler = require("../controllers/ProductController");
const {
  getUsers,
  getUserById,
  register,
  login,
  whoami,
  updateProfile,
  logout,
  uploadProfileImages,
} = require("../controllers/UserController");
const {buyProduct, getNotifBuyer, getNotifSeller, getTransactionHistoryBuyer, getTransactionHistorySeller} = require('../controllers/TransactionController');
const { authorize } = require("../middleware/Authorize");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// handle storage using multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

let upload = multer({ storage: storage });

// Auth Router
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/whoami", whoami);
router.post("/profile/update", uploadProfileImages, updateProfile);

// Product Router
router.get("/products", handler.getAllProduct);
router.get("/products/:id", handler.getProduct);
router.get(
  "/seller/products",
  authorize(accessControl.SELLER),
  handler.getProductSeller
);
router.post(
  "/products",
  [authorize(accessControl.SELLER), upload.single("image")],
  handler.createProduct
);
router.put(
  "/products/:id",
  [authorize(accessControl.SELLER), upload.single("image")],
  handler.updateProduct
);
router.delete(
  "/products/:id",
  authorize(accessControl.SELLER),
  handler.deleteProduct
);

// Transaction router
router.get('/notif/buyer', authorize(accessControl.BUYER), getNotifBuyer);
router.get('/notif/seller', authorize(accessControl.SELLER), getNotifSeller);
router.get('/transaction/buyer', authorize(accessControl.BUYER), getTransactionHistoryBuyer);
router.get('/transaction/seller', authorize(accessControl.SELLER), getTransactionHistorySeller);
router.post('/buy/:id', authorize(accessControl.BUYER), buyProduct);

module.exports = router;
