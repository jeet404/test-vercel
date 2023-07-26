// files
const db = require("../../config/db.config");
const path = require("path");

// modules
const Validator = require("validatorjs");

// models
const Permission = db.permissions;
const { Op } = db.Sequelize;
