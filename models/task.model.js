module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define(
    "tasks",
    {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "projects",
          key: "id",
        },
      },
      board_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "boards",
          key: "id",
        },
      },
      assignee_id: {
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
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      task_file: {
        type: Sequelize.STRING,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("task_file");
          return rawValue ? ASSETS.getProfileURL(rawValue, "taskFiles") : null;
        },
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["todo", "in_progress", "bugs", "to_be_verify", "completed"],
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM,
        values: ["low", "medium", "high"],
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
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
      },
      deletedAt: {
        field: "deleted_at",
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      table_name: "tasks",
      paranoid: true, // ref :  https://sequelize.org/docs/v6/core-concepts/paranoid/

      // ref : https://sequelize.org/docs/v6/other-topics/scopes/
      defaultScope: {
        attributes: {
          exclude: ["deletedAt", "description", "due_date", "task_file"],
        },
      },
    }
  );

  return Task;
};
