const Sequelize = require("sequelize");

const sequelize = require("../providers/sequelize");

class Article extends Sequelize.Model {}

Article.init(
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
    category: {
      type: Sequelize.ENUM,
      values: ["COMPUTER_SCIENCE", "FASHION"]
    }
  },
  {
    sequelize,
    modelName: "article"
  }
);

Article.sync();

module.exports = Article;
