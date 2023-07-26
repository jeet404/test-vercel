const router = require("express").Router();

// Middleware
const auth = require("../middleware/auth");

// Controller
const ProjectController = require("../controllers/project.controller");

//<---------------------------------  Routes  ------------------------------------------>
router.post("/create-project", auth.userAuth, ProjectController.createProject);
router.get(
  "/get-all-projects",
  auth.userAuth,
  ProjectController.getAllProjects
);
router.patch("/update-project", auth.userAuth, ProjectController.updateProject);
router.delete(
  "/delete-project",
  auth.adminAuth,
  ProjectController.removeProject
);

module.exports = router;
