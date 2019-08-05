const Article = require('../../dao/Article');

module.exports = async function createArticle(articlePojo) {
    const article = new Article(articlePojo);
    await article.save();
    return article;
}