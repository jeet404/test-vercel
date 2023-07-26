var suid = require("rand-token").suid;

module.exports = (sequelize, Sequelize) => {
  const UserSession = sequelize.define(
    "user_session",
    {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      tableName: "user_session",
    }
  );
  // create token
  UserSession.createToken = async (user_id) => {
    const token = user_id + suid(99);
    const userSession = await UserSession.create({
      user_id,
      token,
    });
    return userSession;
  };
  return UserSession;
};
