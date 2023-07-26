const db = require("../config/db.config.js");

/**
 * user auth
 */
const userAuth = async (req, res, next) => {
  let isUserAdmin = false;
  const headerToken = req.headers.authorization
    ? req.headers.authorization
    : null;
  const isAuth = await db.user_session.findOne({
    where: {
      token: headerToken,
    },
    attributes: ["user_id"],
  });
  if (isAuth) {
    const user = await db.users.findOne({
      where: {
        id: isAuth.user_id,
      },
    });
    const isAdmin = await db.admin.findOne({
      where: {
        user_id: isAuth.user_id,
      },
    });
    if (isAdmin) {
      isUserAdmin = true;
    }
    if (user) {
      // append loged user
      req.isUserAdmin = isUserAdmin;
      req.user = user;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

/**
 * admin auth
 */
const adminAuth = async (req, res, next) => {
  const headerToken = req.headers.authorization
    ? req.headers.authorization
    : null;
  const isAuth = await db.user_session.findOne({
    where: {
      token: headerToken,
    },
    attributes: ["user_id"],
  });
  if (isAuth) {
    const isAdmin = await db.admin.findOne({
      where: {
        user_id: isAuth.user_id,
      },
    });
    if (isAdmin) {
      req.user = isAdmin;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = {
  userAuth,
  adminAuth,
};
