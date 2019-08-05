const soap = require("soap");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const getArticles = require("./services/articles/getArticles");
const createUser = require("./services/users/createUser");
const login = require("./services/auth/login");

const wrapWithKey = (key, object) => ({ [key]: object });

const blogServices = {
  blogService: {
    blogPort: {
      async getArticles(args) {
        return {
          articles: (await getArticles(args.offset, args.limit)).map(
            wrapWithKey.bind(null, "article")
          )
        };
      },
      async createUser(createUserRequest, cb, headers) {
        if (!headers || !headers.token) {
          throw new Error("Not authorized");
        }
        const payload = jwt.verify(headers.token, process.env.JWT_SECRET, {
          issuer: "blog-service"
        });
        if (payload.role !== "ADMIN") {
          throw new Error("Not authorized");
        }
        return {
          user: await createUser(createUserRequest)
        };
      },
      async login(loginRequest) {
        return {
          token: await login(loginRequest)
        };
      }
    }
  }
};

const app = express();
const wsdl = fs.readFileSync(__dirname + "/wsdl.xml", "utf8");
app.listen(8086, "0.0.0.0", () => {
  console.log("soap server listening on port 8086");
  soap.listen(
    app,
    {
      path: "/blog",
      services: blogServices,
      xml: wsdl
      // namespaceArrayElements: false,
    },
    function() {
      console.log("soap server initialized");
    }
  );
});
