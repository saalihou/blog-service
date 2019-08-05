const Article = require('../../dao/Article');

module.exports = async function getArticles(offset, limit) {
    return (await Article.findAll({offset, limit})).map(article => article.toJSON());
}