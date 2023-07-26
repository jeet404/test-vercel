module.exports = (sequelize, Sequelize) => {
  const UserDetails = sequelize.define(
    "user_details",
    {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      /* if we use sapatate table for team then we need to add team_id in user_details table
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "teams",
          key: "id",
        },
      },*/
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("profile_image");
          return rawValue
            ? ASSETS.getImageURL(rawValue, "profileImages")
            : null;
        },
      },
      job_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      /* if we use name as team then we need to add team_or_department in user_details table
      team_or_department: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      */
      about_me: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        field: "created_at",
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: "updated_at",
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "user_details",

      // ref : https://sequelize.org/docs/v6/other-topics/scopes/
      defaultScope: {
        attributes: {
          exclude: ["about_me", "job_title"],
        },
      },
    }
  );
  return UserDetails;
};
