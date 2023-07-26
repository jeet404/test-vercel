module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define(
    "tags",
    {
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tasks",
          key: "id",
        },
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      color: {
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
      deletedAt: {
        field: "deleted_at",
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      table_name: "tags",
      paranoid: true, // ref :  https://sequelize.org/docs/v6/core-concepts/paranoid/

      // ref : https://sequelize.org/docs/v6/other-topics/scopes/
      defaultScope: {
        attributes: { exclude: ["deletedAt"] },
      },
    }
  );
  return Tag;
};
