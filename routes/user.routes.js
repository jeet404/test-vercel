const router = require("express").Router();

// Middleware
const auth = require("../middleware/auth");
const { uploadImage } = require("../middleware/uploadFile");

// Controller
const UserController = require("../controllers/user.controller");

//<---------------------------------  Routes  ------------------------------------------>

// User
router.post("/login", UserController.userLogin);
router.post("/signup", UserController.userSignup);
router.post("/logout", auth.userAuth, UserController.userLogout);
router.post(
  "/add-user-details",
  auth.userAuth,
  uploadImage("profileImages", "profile_image"),
  UserController.addUserDetails
);
router.get("/get-user-profile", auth.userAuth, UserController.getUserProfile);
router.patch(
  "/update-user",
  auth.userAuth,
  uploadImage("profileImages", "profile_image"),
  UserController.updateUser
);
router.patch("/change-password", auth.userAuth, UserController.changePassword);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password/:token", UserController.resetPassword);

module.exports = router;
