const { test, after, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const listHelper = require("../utils/list_helper");
const logger = require("../utils/logger");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  const user = await User.findById("664ffc1ace791e9fe8d80064");

  const initialBlogs = [
    {
      title: "And still, I rise",
      author: "Maya Angelou",
      user,
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
    },
    {
      title: "The Road Not Taken",
      author: "Cormac McCarthy",
      user,
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 10,
    },
    {
      title: "Impossible is for the unwilling.",
      author: "John Keats",
      user,
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 0,
    },
  ];

  await Blog.deleteMany({});
  logger.info("db cleared");

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0,
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });

  test("most liked blog", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });

  test("author with largest amount of blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  test("author with most likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, 3);
});

test("the unique identifier is named id", async () => {
  const response = await api.get("/api/blogs");
  const blogTitles = response.body.map((blog) => blog.title);
  const ids = response.body.map((blog) => blog.id);

  // Fetch blog by their IDs
  const blogsPromise = ids.map((id) => Blog.findById(id));
  const refetchedBlog = await Promise.all(blogsPromise);
  const refetchedBlogTitles = refetchedBlog.map((blog) => blog.title);

  assert.deepStrictEqual(blogTitles, refetchedBlogTitles);
});

describe("blog functions that require token", async () => {
  const tester = {
    username: "tester",
    password: "letmetest",
  };

  const token = (await api.post("/api/login").send(tester)).body.token;

  test("verifying a successful POST request", async () => {
    const newBlog = {
      title: "I'll leave tomorrow's problems to tomorrow's me.",
      author: "Saitama",
      userId: "664ffc1ace791e9fe8d80064",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 1002,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog);
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, 4);
  });

  test("likes set to 0 if not provided", async () => {
    const newBlog = {
      title: "I'll leave tomorrow's problems to tomorrow's me.",
      author: "Saitama",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog);
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body[3].likes, 0);
  });

  test("server response 400 if title or url is missing", async () => {
    const newBlog = {
      author: "Saitama",
      likes: 1002,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "Bearer " + token)
      .send(newBlog)
      .expect(400);
  });

  test("verifying a successful DELETE request", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToDelete = blogsAtStart.body[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);

    const blogsAtEnd = await api.get("/api/blogs");

    assert.strictEqual(blogsAtEnd.body.length, 2);

    const titles = blogsAtEnd.body.map((blog) => blog.title);

    assert.strictEqual(titles.includes(blogToDelete.title), false);
  });
});
test("verifying a successful PUT request", async () => {
  const blogsAtStart = await api.get("/api/blogs");
  const blogToUpdate = blogsAtStart.body[0];

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  };

  await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200);

  const blogsAtEnd = await api.get("/api/blogs");

  assert.strictEqual(blogsAtEnd.body[0].likes, updatedBlog.likes);
});

describe("user validation", () => {
  test("username is less than 3 character", async () => {
    const newUser = {
      username: "yu",
      name: "Otosaka",
      password: "purge**-",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("username must be at least 3 character long")
    );
  });

  test("username is not provided", async () => {
    const newUser = {
      name: "void",
      password: "___________",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("username is required"));
  });

  test("password is less than 6 character", async () => {
    const newUser = {
      username: "vanderwall",
      name: "Grace",
      password: "ysb",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes(
        "password length must be at least 6 character long"
      )
    );
  });

  test("password in not provided", async () => {
    const newUser = {
      username: "fmt990",
      name: "FMT",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("password is required"));
  });
});

after(async () => {
  await mongoose.connection.close();
});
