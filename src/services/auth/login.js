const omit = require("lodash/omit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../dao/User");

module.exports = async function login(loginDto) {
  const user = await User.findOne({ email: loginDto.email });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  if (!(await bcrypt.compare(loginDto.password, user.password))) {
    throw new Error("Invalid credentials");
  }
  return await jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      issuer: "blog-service"
    }
  );
};
