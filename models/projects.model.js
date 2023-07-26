module.exports = (sequelize, Sequelize) => {
  const Projects = sequelize.define(
    "projects",
    {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      color: {
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
      tableName: "projects",
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
  Projects.isExistField = async (whereClause) => {
    return await Projects.findOne({ where: whereClause });
  };

  return Projects;
};
