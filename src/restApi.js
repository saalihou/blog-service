const restify = require("restify");
const restifyPromise = require("restify-await-promise");
const jwt = require("express-jwt");

const getArticles = require("./services/articles/getArticles");
const createArticle = require("./services/articles/createArticle");

const server = restify.createServer();

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
restifyPromise.install(server);

server.get("/api/articles", async (req, res) => {
  res.send({
    articles: await getArticles(
      parseInt(req.query.offset),
      parseInt(req.query.limit)
    )
  });
});

server.post(
  "/api/articles",
  jwt({ secret: process.env.JWT_SECRET, issuer: "blog-service" }),
  async (req, res) => {
    if (req.user.role !== "ADMIN" && req.user.role !== "EDITOR") {
      throw new Error("Not authorized to create article");
    }
    res.send({
      article: await createArticle(req.body)
    });
  }
);

server.listen(8085, () => {
  console.log("%s listening at %s", server.name, server.url);
});
