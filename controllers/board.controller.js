// files
const db = require("../config/db.config");
const path = require("path");

// modules
const Validator = require("validatorjs");

// models
const Board = db.boards;
const Project = db.projects;
const { Op } = db.Sequelize;

/**
 * Create New Board
 */
const createBoard = async (req, res) => {
  console.log("Create Board Fired");
  const { name, project_id } = req.body;
  const validation = new Validator(req.body, {
    name: "required|string",
    project_id: "required|integer",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const isExistProject = await Project.isExistField({
      id: project_id,
      deletedAt: null,
    });
    if (!isExistProject) {
      return RESPONSE.error(res, 3001);
    }
    const isExistBoard = await Board.isExistField({
      name: name,
    });
    if (isExistBoard) {
      return RESPONSE.error(res, 4006);
    }
    const newBoard = await Board.create({
      name,
      project_id,
      user_id: req.user.id,
    });
    return RESPONSE.success(res, 4002, newBoard);
  } catch (err) {
    console.log(err);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Get All Boards
 */
const getAllBoards = async (req, res) => {
  console.log("Get All Boards Fired");
  try {
    const boards = await Board.findAll({
      where: {
        deletedAt: null,
      },
    });
    return RESPONSE.success(res, 4005, boards);
  } catch (err) {
    console.log(err);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Get Board by Project ID
 */
const getBoardByProjectId = async (req, res) => {
  console.log("Get All Boards Fired");
  const project_id = req.params.id;
  try {
    const isExistProject = await Project.isExistField({
      id: project_id,
      deletedAt: null,
    });
    if (!isExistProject) {
      return RESPONSE.error(res, 3001);
    }
    const boards = await Board.findAll({
      where: {
        project_id,
        deletedAt: null,
      },
    });
    return RESPONSE.success(res, 4005, boards);
  } catch (err) {
    console.log(err);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Update Board
 */
const updateBoard = async (req, res) => {
  console.log("Update Board Fired");
  const { id } = req.params;
  const { name, project_id } = req.body;
  const validation = new Validator(req.body, {
    name: "required|string",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const isExistBoard = await Board.isExistField({
      id,
      deletedAt: null,
    });
    if (!isExistBoard) {
      return RESPONSE.error(res, 4001);
    }
    const isExistBoardName = await Board.isExistField({
      name,
      deletedAt: null,
      id: {
        [Op.ne]: id,
      },
    });
    if (isExistBoardName) {
      return RESPONSE.error(res, 4006);
    }
    const updatedBoard = await Board.update(
      {
        project_id,
        name,
      },
      {
        where: {
          id,
        },
      }
    );
    return RESPONSE.success(res, 4003);
  } catch (err) {
    console.log(err);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Remove Board
 */
const removeBoard = async (req, res) => {
  console.log("Remove Board Fired");
  const { id } = req.params;
  try {
    const isExistBoard = await Board.isExistField({
      id,
      deletedAt: null,
    });
    if (!isExistBoard) {
      return RESPONSE.error(res, 4001);
    }
    const deletedBoard = await Board.destroy({
      where: {
        id,
      },
    });
    return RESPONSE.success(res, 4004);
  } catch (err) {
    console.log(err);
    return RESPONSE.error(res, 9999);
  }
};

module.exports = {
  createBoard,
  getAllBoards,
  getBoardByProjectId,
  updateBoard,
  removeBoard,
};
