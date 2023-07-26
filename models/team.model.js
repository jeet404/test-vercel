module.exports = (sequelize, Sequelize) => {
  const Team = sequelize.define(
    "teams",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
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
      deletedAt: {
        field: "deleted_at",
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "teams",
      paranoid: true, // ref :  https://sequelize.org/docs/v6/core-concepts/paranoid/

      // ref : https://sequelize.org/docs/v6/other-topics/scopes/
      defaultScope: {
        attributes: {
          exclude: ["deletedAt"],
        },
      },
    }
  );

  // check field is exist or not in table --> return obj or null
  Team.isExistField = async function (whereClause) {
    return await Team.findOne({ where: whereClause });
  };

  return Team;
};
