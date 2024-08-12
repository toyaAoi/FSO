const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  return response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  if (!password) {
    return response.status(400).json({ error: "password is required" });
  }

  if (password.length < 6) {
    return response
      .status(400)
      .json({ error: "password length must be at least 6 character long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, name, passwordHash });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
