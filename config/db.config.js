const Sequelize = require("sequelize");
const config = require("./config");
// database connection
const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: config.database.dialect,
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
    ...(config.mode == "server" && {
      logging: false,
      dialectOptions: {
        socketPath: "/var/run/mysqld/mysqld.sock",
      },
    }),
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// import models
/*-----------------For Admin--------------------*/
db.admin = require("../models/admin.model.js")(sequelize, Sequelize);

/*-----------------For Users--------------------*/
db.users = require("../models/users.model.js")(sequelize, Sequelize);
db.user_details = require("../models/user_details.model.js")(
  sequelize,
  Sequelize
);
db.user_session = require("../models/user_session.model.js")(
  sequelize,
  Sequelize
);

/*-----------------For Team--------------------*/
// db.teams = require("../models/team.model.js")(sequelize, Sequelize);

/*-----------------For Project--------------------*/
db.projects = require("../models/projects.model.js")(sequelize, Sequelize);

/*-----------------For Board--------------------*/
db.boards = require("../models/board.model.js")(sequelize, Sequelize);

/*-----------------For Task--------------------*/
db.tasks = require("../models/task.model.js")(sequelize, Sequelize);
db.sub_tasks = require("../models/sub_task.model.js")(sequelize, Sequelize);
db.task_labels = require("../models/task_label.model.js")(sequelize, Sequelize);

/*-----------------For Comment--------------------*/
db.comments = require("../models/comment.model.js")(sequelize, Sequelize);

/*-----------------For Permission--------------------*/
db.permissions = require("../models/permission.model.js")(sequelize, Sequelize);

/*-----------------Invite--------------------*/
db.invite_user_for_project =
  require("../models/invite_user_for_project.model.js")(sequelize, Sequelize);

/*-----------------For Likes--------------------*/
db.likes = require("../models/like.model.js")(sequelize, Sequelize);

/*-----------------For Tags--------------------*/
db.tags = require("../models/tag.model.js")(sequelize, Sequelize);

// define associations
/*-----------------For Users to Admin--------------------*/
db.users.hasMany(db.admin, {
  foreignKey: "user_id",
});
db.admin.belongsTo(db.users, {
  foreignKey: "user_id",
});

/*-----------------For Users to UserDetails--------------------*/
db.users.hasMany(db.user_details, {
  foreignKey: "user_id",
});
db.user_details.belongsTo(db.users, {
  foreignKey: "user_id",
});

/*-----------------For Users to UserSession--------------------*/
db.users.hasMany(db.user_session, {
  foreignKey: "user_id",
});
db.user_session.belongsTo(db.users, {
  foreignKey: "user_id",
});

/*-----------------For Team to UserDetails--------------------
db.teams.hasMany(db.user_details, {
  foreignKey: "team_id",
});
db.user_details.belongsTo(db.teams, {
  foreignKey: "team_id",
});
*/

/*-----------------For Users to Projects--------------------*/
db.users.hasMany(db.projects, {
  foreignKey: "user_id",
});
db.projects.belongsTo(db.users, {
  foreignKey: "user_id",
});

/*-----------------For Team to Projects--------------------
db.teams.hasMany(db.projects, {
  foreignKey: "team_id",
});
db.projects.belongsTo(db.teams, {
  foreignKey: "team_id",
});
*/

/*-----------------For Projects to Boards--------------------*/
db.projects.hasMany(db.boards, {
  foreignKey: "project_id",
});
db.boards.belongsTo(db.projects, {
  foreignKey: "project_id",
});

/*-----------------For Projects to Tasks--------------------*/
db.projects.hasMany(db.tasks, {
  foreignKey: "project_id",
});
db.tasks.belongsTo(db.projects, {
  foreignKey: "project_id",
});

/*-----------------For Boards to Tasks--------------------*/
db.boards.hasMany(db.tasks, {
  foreignKey: "board_id",
});
db.tasks.belongsTo(db.boards, {
  foreignKey: "board_id",
});

/*-----------------For Users to Tasks--------------------*/
db.users.hasMany(db.tasks, {
  foreignKey: "user_id",
});
db.tasks.belongsTo(db.users, {
  foreignKey: "user_id",
});

/*-----------------For Users(assignee) to Tasks--------------------*/
db.users.hasMany(db.tasks, {
  foreignKey: "assignee_id",
});
db.tasks.belongsTo(db.users, {
  foreignKey: "assignee_id",
});

/*-----------------For Tasks to SubTasks--------------------*/
db.tasks.hasMany(db.sub_tasks, {
  foreignKey: "task_id",
});
db.sub_tasks.belongsTo(db.tasks, {
  foreignKey: "task_id",
});

/*-----------------For Tasks to TaskLabels--------------------*/
db.tasks.hasMany(db.task_labels, {
  foreignKey: "task_id",
});
db.task_labels.belongsTo(db.tasks, {
  foreignKey: "task_id",
});

/*-----------------For Tasks to Comments--------------------*/
db.tasks.hasMany(db.comments, {
  foreignKey: "task_id",
});
db.comments.belongsTo(db.tasks, {
  foreignKey: "task_id",
});

/*-----------------For Users to Comments--------------------*/
db.users.hasMany(db.comments, {
  foreignKey: "assignee_id",
});
db.comments.belongsTo(db.users, {
  foreignKey: "assignee_id",
});

/*-----------------For Users to Likes--------------------*/
db.users.hasMany(db.likes, {
  foreignKey: "user_id",
});
db.likes.belongsTo(db.users, {
  foreignKey: "user_id",
});

/*-----------------For Tasks to Likes--------------------*/
db.tasks.hasMany(db.likes, {
  foreignKey: "task_id",
});
db.likes.belongsTo(db.tasks, {
  foreignKey: "task_id",
});

/*-----------------For Tasks to Tags--------------------*/
db.tasks.hasMany(db.tags, {
  foreignKey: "task_id",
});
db.tags.belongsTo(db.tasks, {
  foreignKey: "task_id",
});

/*-----------------For Projects to Invite--------------------*/
db.projects.hasMany(db.invite_user_for_project, {
  foreignKey: "project_id",
});
db.invite_user_for_project.belongsTo(db.projects, {
  foreignKey: "project_id",
});

/*-----------------For Users to Invite--------------------*/
db.users.hasMany(db.invite_user_for_project, {
  foreignKey: "invited_by",
});
db.invite_user_for_project.belongsTo(db.users, {
  foreignKey: "invited_by",
});
db.users.hasMany(db.invite_user_for_project, {
  foreignKey: "invited_user",
});
db.invite_user_for_project.belongsTo(db.users, {
  foreignKey: "invited_user",
});

/*-----------------For Users to Permission--------------------*/
db.users.hasMany(db.permissions, {
  foreignKey: "user_id",
});
db.permissions.belongsTo(db.users, {
  foreignKey: "user_id",
});

/*-----------------For Projects to Permission--------------------*/
db.projects.hasMany(db.permissions, {
  foreignKey: "project_id",
});
db.permissions.belongsTo(db.projects, {
  foreignKey: "project_id",
});

module.exports = db;
