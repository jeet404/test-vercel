// files
const db = require("../../config/db.config");
const path = require("path");

// modules
const Validator = require("validatorjs");
const moment = require("moment");
const bcrypt = require("bcryptjs");

// models
const User = db.users;
const UserSession = db.user_session;
const Admin = db.admin;
const { Op } = db.Sequelize;

/**
 * Login
 */
const adminLogin = async (req, res) => {
  console.log("Login Fired");
  let validation = new Validator(req.body, {
    email: "required",
    password: "required",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({
      include: [
        {
          model: User,
          as: "user",
          where: {
            email,
          },
        },
      ],
    });
    if (!admin) {
      return RESPONSE.error(res, 1001);
    }
    const isMatch = await bcrypt.compare(password, admin.user.password);
    if (!isMatch) {
      return RESPONSE.error(res, 1005);
    }
    return RESPONSE.success(res, 1002, {
      token: await UserSession.createToken(admin.user.id),
    });
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Logout
 */
const adminLogout = async (req, res) => {
  console.log("Logout User Fired");
  try {
    const user = req.user;
    await UserSession.destroy({
      where: {
        user_id: user.id,
      },
    });
    return RESPONSE.success(res, 1007);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

module.exports = {
  adminLogin,
  adminLogout,
};
