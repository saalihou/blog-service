const Sequelize = require("sequelize");
const bcrypt = require('bcrypt');

const sequelize = require("../providers/sequelize");

class User extends Sequelize.Model {}

User.init(
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
        type: Sequelize.ENUM,
        values: ["ADMIN", "EDITOR", "BROWSER"],
        defaultValue: "BROWSER"
    },
  },
  {
    sequelize,
    modelName: "user"
  }
);

User.beforeCreate(async user => {
    user.password = await bcrypt.hash(user.password, 10);
});

User.sync();

module.exports = User;
