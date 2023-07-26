// files
const db = require("../../config/db.config");
const path = require("path");

// modules
const Validator = require("validatorjs");

// models
const User = db.users;
const UserDetail = db.user_details;
const UserSession = db.user_session;
const { Op } = db.Sequelize;

/**
 * Add New User
 */
const addUser = async (req, res) => {
  console.log("Add User Fired");
  const { username, email, password } = req.body;
  const validation = new Validator(req.body, {
    username: "required",
    email: "required",
    password: "required",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      return RESPONSE.error(res, 1013);
    }
    const newUser = await User.create({
      username,
      email,
      password,
    });
    return RESPONSE.success(res, 1014, newUser);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Get All Users
 */
const getAllUsers = async (req, res) => {
  console.log("Get All Users Fired");
  try {
    const users = await User.findAll({
      include: [
        {
          model: UserDetail,
        },
      ],
    });
    return RESPONSE.success(res, 1015, users);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Get User By Id
 */
const getUserById = async (req, res) => {
  console.log("Get User By Id Fired");
  try {
    const user = await User.findOne({
      include: [
        {
          model: UserDetail,
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    return RESPONSE.success(res, 1015, user);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Add User Details
 */
const addUserDetails = async (req, res) => {
  console.log("Add User Details Fired");
  try {
    const { user_id, name, team_id, job_title, about_me } = req.body;
    const profile_image = req.file ? req.file.filename : "";
    const userDetails = await UserDetail.create({
      user_id,
      team_id,
      name,
      profile_image,
      job_title,
      about_me,
    });
    return RESPONSE.success(res, 1003, userDetails.toJSON());
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Update User
 */
const updateUser = async (req, res) => {
  console.log("Update User Fired");
  let errUserDetails = "";
  try {
    const { username, email, name, team_id, job_title, about_me, user_id } =
      req.body;
    const profile_image = req.file ? req.file.filename : "";
    if (profile_image) {
      const userDetail = await UserDetail.findOne({
        where: {
          user_id: user_id,
        },
      });
      if (userDetail) {
        if (userDetail.profile_image !== "") {
          await FILEACTION.deleteFile(
            path.basename(userDetail.profile_image),
            "images/profileImages"
          );
        }
        await UserDetail.update(
          {
            name,
            team_id,
            profile_image,
            job_title,
            about_me,
          },
          {
            where: {
              user_id: user_id,
            },
          }
        );
      } else {
        if (profile_image !== "") {
          await FILEACTION.deleteFile(
            path.basename(profile_image),
            "images/profileImages"
          );
        }
        errUserDetails = "First Add User Details Then Update";
      }
    }
    await User.update(
      {
        username,
        email,
      },
      {
        where: {
          id: user_id,
        },
      }
    );
    return RESPONSE.success(res, 1009, errUserDetails);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Remove User
 */
const removeUser = async (req, res) => {
  console.log("Remove User Fired");
  try {
    const { id } = req.body;
    const userDetail = await UserDetail.findOne({
      where: {
        user_id: id,
      },
    });
    if (userDetail) {
      if (userDetail.profile_image !== "") {
        await FILEACTION.deleteFile(
          path.basename(userDetail.profile_image),
          "images/profileImages"
        );
      }
    } else {
      return RESPONSE.error(res, 1001);
    }
    await UserDetail.destroy({
      where: {
        user_id: id,
      },
    });
    await User.destroy({
      where: {
        id: id,
      },
    });
    return RESPONSE.success(res, 1012);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Change Password
 */
const changePassword = async (req, res) => {
  console.log("Change Password Fired");
  try {
    const { user_id, new_password } = req.body;
    const validation = new Validator(req.body, {
      user_id: "required",
      new_password: "required",
    });
    if (validation.fails()) {
      firstMessage = Object.keys(validation.errors.all())[0];
      return RESPONSE.error(res, validation.errors.first(firstMessage));
    }
    await User.update(
      {
        password: new_password,
      },
      {
        where: {
          id: user_id,
        },
      }
    );
    return RESPONSE.success(res, 1011);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Change User Status
 */
const changeUserStatus = async (req, res) => {
  console.log("Change User Status Fired");
  try {
    const { user_id, is_active } = req.body;
    const validation = new Validator(req.body, {
      is_active: "required",
    });
    if (validation.fails()) {
      firstMessage = Object.keys(validation.errors.all())[0];
      return RESPONSE.error(res, validation.errors.first(firstMessage));
    }
    await User.update(
      {
        is_active,
      },
      {
        where: {
          id: user_id,
        },
      }
    );
    return RESPONSE.success(res, 1016);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  addUserDetails,
  updateUser,
  removeUser,
  changePassword,
  changeUserStatus,
};
