var suid = require("rand-token").suid;
const bcrypt = require("bcryptjs");
module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    "users",
    {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reset_password_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_password_expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deletedAt: {
        field: "deleted_at",
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, "a");
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, "a");
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
      instanceMethods: {
        validPassword: (password) => {
          return bcrypt.compareSync(password, this.password);
        },
      },
    },
    {
      tableName: "users",
      paranoid: true, // ref :  https://sequelize.org/docs/v6/core-concepts/paranoid/

      // ref : https://sequelize.org/docs/v6/other-topics/scopes/
      defaultScope: {
        attributes: {
          exclude: [
            "password",
            "reset_password_token",
            "reset_password_expires",
            "deletedAt",
          ],
        },
      },
    }
  );

  Users.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
  };

  // check field is exist or not in table --> return obj or null
  Users.isExistField = async (whereClause) => {
    return await Users.findOne({ where: whereClause });
  };

  Users.createResetPasswordToken = async (user_id) => {
    const reset_password_token = user_id + suid(99);
    const reset_password_expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    const userResetToken = await Users.update(
      {
        reset_password_token,
        reset_password_expires,
      },
      {
        where: {
          id: user_id,
        },
      }
    );
    return userResetToken;
  };

  return Users;
};
