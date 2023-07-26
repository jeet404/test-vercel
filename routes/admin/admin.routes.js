const router = require("express").Router();

// Middleware
const auth = require("../../middleware/auth");
const { uploadImage } = require("../../middleware/uploadFile");

// Controller
const AdminController = require("../../controllers/admin/admin.controller");
const TeamController = require("../../controllers/admin/team.controller");
const UserController = require("../../controllers/admin/user.controller");

//<---------------------------------  Routes  ------------------------------------------>

// Admin
router.post("/login", AdminController.adminLogin);
router.post("/logout", auth.adminAuth, AdminController.adminLogout);

// Team
router.post("/team/create-team", auth.adminAuth, TeamController.createTeam);
router.post("/team/update-team/", auth.adminAuth, TeamController.updateTeam);
router.delete("/team/remove-team/", auth.adminAuth, TeamController.removeTeam);
router.get("/team/get-all-teams", auth.adminAuth, TeamController.getAllTeams);

// User
router.post("/user/create-user", auth.adminAuth, UserController.addUser);
router.post(
  "/user/add-user-details",
  auth.adminAuth,
  uploadImage("profileImages", "profile_image"),
  UserController.addUserDetails
);
router.patch(
  "/user/update-user",
  auth.adminAuth,
  uploadImage("profileImages", "profile_image"),
  UserController.updateUser
);
router.delete("/user/remove-user", auth.adminAuth, UserController.removeUser);
router.get("/user/get-all-users", auth.adminAuth, UserController.getAllUsers);
router.get("/user/get-user/:id", auth.adminAuth, UserController.getUserById);
router.patch(
  "/user/change-password",
  auth.adminAuth,
  UserController.changePassword
);
router.patch(
  "/user/update-user-status",
  auth.adminAuth,
  UserController.changeUserStatus
);

module.exports = router;
