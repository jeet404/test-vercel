// files
const db = require("../config/db.config");
const path = require("path");

// modules
const Validator = require("validatorjs");
const moment = require("moment");
const bcrypt = require("bcryptjs");

// models
const User = db.users;
const UserDetail = db.user_details;
const UserSession = db.user_session;
const { Op } = db.Sequelize;

/**
 * Signup
 */
const userSignup = async (req, res) => {
  console.log("Signup Fired");
  console.log(req.body);
  let validation = new Validator(req.body, {
    username: "required",
    email: "required",
    password: "required",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { password }],
      },
    });
    if (user) {
      if (user.email == email) {
        return RESPONSE.error(res, 1003);
      } else {
        return RESPONSE.error(res, 1008);
      }
    }
    const newUser = await User.create({
      username,
      email,
      password,
    });
    return RESPONSE.success(res, 1008, newUser.toJSON());
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Login
 */
const userLogin = async (req, res) => {
  console.log("Login Fired");
  console.log(req.body);
  let validation = new Validator(req.body, {
    email: "required",
    password: "required",
  });
  if (validation.fails()) {
    firstMessage = Object.keys(validation.errors.all())[0];
    return RESPONSE.error(res, validation.errors.first(firstMessage));
  }
  try {
    let userDetailSet = {};
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return RESPONSE.error(res, 1001);
    }
    const userDetails = await UserDetail.findOne({
      where: {
        user_id: user.id,
      },
    });
    if (userDetails) {
      userDetailSet = userDetails.toJSON();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return RESPONSE.error(res, 1005);
    }
    return RESPONSE.success(res, 1002, {
      user: user.toJSON(),
      user_details: userDetailSet,
      token: await UserSession.createToken(user.id),
    });
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
    const user = req.user;
    const { name, job_title, about_me } = req.body;
    const profile_image = req.file ? req.file.filename : "";
    const userDetails = await UserDetail.create({
      user_id: user.id,
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
 * Get Profile
 */
const getUserProfile = async (req, res) => {
  console.log("Get Profile Fired");
  try {
    const user = req.user;
    const userProfile = await User.findOne({
      include: [
        {
          model: UserDetail,
          as: "user_details",
        },
      ],
      where: {
        id: user.id,
      },
    });
    return RESPONSE.success(res, 1006, userProfile.toJSON());
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
  try {
    const user = req.user;
    const { username, email, name, job_title, about_me } = req.body;
    const profile_image = req.file ? req.file.filename : "";
    if (profile_image) {
      const userDetail = await UserDetail.findOne({
        where: {
          user_id: user.id,
        },
      });
      if (userDetail.profile_image) {
        await FILEACTION.deleteFile(
          path.basename(userDetail.profile_image),
          "images/profileImages"
        );
      }
    }
    await User.update(
      {
        username,
        email,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    await UserDetail.update(
      {
        name,
        profile_image,
        job_title,
        about_me,
      },
      {
        where: {
          user_id: user.id,
        },
      }
    );
    return RESPONSE.success(res, 1009);
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
    const user = req.user;
    const { old_password, new_password } = req.body;
    const isMatch = await bcrypt.compare(old_password, user.password);
    const newPassword = await bcrypt.hash(new_password, 8);
    if (!isMatch) {
      return RESPONSE.error(res, 1005);
    }
    await User.update(
      {
        password: newPassword,
      },
      {
        where: {
          id: user.id,
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
 * Forgot Password
 */
const forgotPassword = async (req, res) => {
  console.log("Forgot Password Fired");
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return RESPONSE.error(res, 1001);
    }
    const token = await User.createResetPasswordToken(user.id);
    const resetLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL || "communitycoder3@gmail.com",
      to: email,
      subject: "Reset Password",
      html: `<p>Click on the link to reset your password: ${resetLink}</p>`,
    };
    await MAIL.sendMail(mailOptions);
    return RESPONSE.success(res, 1010);
  } catch (error) {
    console.log(error);
    return RESPONSE.error(res, 9999);
  }
};

/**
 * Reset Password
 */
const resetPassword = async (req, res) => {
  console.log("Reset Password Fired");
  try {
    const { reset_password_token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.and]: [
          {
            reset_password_token,
          },
          {
            reset_password_expires: {
              [Op.gt]: moment().toDate(),
            },
          },
        ],
      },
    });
    if (!user) {
      return RESPONSE.error(res, 1001);
    }
    await User.update(
      {
        password: newPassword,
      },
      {
        where: {
          id: user.user_id,
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
 * Logout
 */
const userLogout = async (req, res) => {
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
  userSignup,
  userLogin,
  userLogout,
  addUserDetails,
  getUserProfile,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
