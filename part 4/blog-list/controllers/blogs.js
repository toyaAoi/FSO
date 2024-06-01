const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    const { title, author, user, url, likes } = request.body;

    const currentUser = await User.findById(user.id);

    const blog = new Blog({
      title,
      author,
      user: currentUser,
      url,
      likes: likes || 0,
    });

    const savedBlog = await blog.save();

    currentUser.blogs.push(savedBlog._id);
    await currentUser.save();

    response.status(201).json(savedBlog);
  }
);

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const blog = await Blog.findById(request.params.id);

    if (!(request.body.user.id === blog.user._id.toString())) {
      return response.status(404).json({
        error: "only the user who created this blog can delete",
      });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  }
);

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
