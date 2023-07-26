const router = require("express").Router();

// Middleware
const auth = require("../middleware/auth");

// Controller
const BoardController = require("../controllers/board.controller");

//<---------------------------------  Routes  ------------------------------------------>
router.post("/create-board", auth.userAuth, BoardController.createBoard);
router.get("/get-all-boards", auth.userAuth, BoardController.getAllBoards);
router.get(
  "/get-board/:id",
  auth.userAuth,
  BoardController.getBoardByProjectId
);
router.patch("/update-board/:id", auth.userAuth, BoardController.updateBoard);
router.delete("/remove-board/:id", auth.userAuth, BoardController.removeBoard);

module.exports = router;
