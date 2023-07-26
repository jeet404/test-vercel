// files
const db = require("../../config/db.config");
const path = require("path");

// modules
const Validator = require("validatorjs");

// models
const Team = db.teams;
const { Op } = db.Sequelize;

/**
 * Create Team
 */
const createTeam = async (req, res) => {
  console.log("Create Team Fired");
  const { name, description } = req.body;
  let validation = new Validator(req.body, {
    name: "required",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const team = await Team.findOne({
      where: {
        [Op.or]: [{ name }],
      },
    });
    if (team) {
      if (team.name == name) {
        return RESPONSE.error(res, 2006);
      }
    }
    const newTeam = await Team.create({
      name,
      description,
    });
    return RESPONSE.success(res, 2002, newTeam.toJSON());
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Update Team
 */
const updateTeam = async (req, res) => {
  console.log("Update Team Fired");
  const { id, name, description } = req.body;
  try {
    await Team.update(
      {
        name,
        description,
      },
      {
        where: {
          id,
        },
      }
    );
    return RESPONSE.success(res, 2003);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Remove Team
 */
const removeTeam = async (req, res) => {
  console.log("Remove Team Fired");
  const { id } = req.body;
  try {
    const removedTeam = await Team.destroy({
      where: {
        id,
      },
    });
    if (!removedTeam) {
      return RESPONSE.error(res, 2001);
    }
    return RESPONSE.success(res, 2004);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Get All Teams
 */
const getAllTeams = async (req, res) => {
  console.log("Get All Teams Fired");
  try {
    const teams = await Team.findAll();
    if (!teams) {
      return RESPONSE.error(res, 2001);
    }
    return RESPONSE.success(res, 2005, teams);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

module.exports = {
  createTeam,
  updateTeam,
  removeTeam,
  getAllTeams,
};
