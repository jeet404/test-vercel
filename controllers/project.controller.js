// files
const db = require("../config/db.config");
const path = require("path");

// modules
const Validator = require("validatorjs");

// models
const Project = db.projects;

/**
 * Create New Project
 */
const createProject = async (req, res) => {
  console.log("Create Project Fired");
  const { name, color } = req.body;
  const validation = new Validator(req.body, {
    name: "required",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const project = await Project.findOne({
      where: {
        name,
      },
    });
    if (project) {
      return RESPONSE.error(res, 3006);
    }
    const newProject = await Project.create({
      user_id: req.user.id,
      name,
      color,
    });
    return RESPONSE.success(res, 3002, newProject);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Get All Projects
 */
const getAllProjects = async (req, res) => {
  console.log("Get All Projects Fired");
  try {
    const projects = await Project.findAll({});
    return RESPONSE.success(res, 3005, projects);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Update Project
 */
const updateProject = async (req, res) => {
  console.log("Update Project Fired");
  const { project_id, name, color } = req.body;
  const validation = new Validator(req.body, {
    project_id: "required",
    name: "required",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const project = await Project.findOne({
      where: {
        id: project_id,
      },
    });
    if (!project) {
      return RESPONSE.error(res, 3001);
    }
    const updatedProject = await Project.update(
      {
        name,
        color,
      },
      {
        where: {
          id: project_id,
        },
      }
    );
    return RESPONSE.success(res, 3003);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Remove Project
 */
const removeProject = async (req, res) => {
  console.log("Remove Project Fired");
  const { project_id } = req.body;
  const validation = new Validator(req.body, {
    project_id: "required",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const project = await Project.findOne({
      where: {
        id: project_id,
      },
    });
    if (!project) {
      return RESPONSE.error(res, 3001);
    }
    const deletedProject = await Project.destroy({
      where: {
        id: project_id,
      },
    });
    return RESPONSE.success(res, 3004);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  removeProject,
};
