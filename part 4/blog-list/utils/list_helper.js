const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const likesArray = blogs.map((blog) => blog.likes);
  const mostLikedBlog = blogs[likesArray.indexOf(Math.max(...likesArray))];

  const { _id, url, __v, ...filteredBlog } = mostLikedBlog;

  return filteredBlog;
};

const mostBlogs = (blogs) => {
  const authors = new Map();
  blogs.forEach((blog) => {
    authors.set(blog.author, (authors.get(blog.author) || 0) + 1);
  });

  const mostBlogAuthor = Array.from(authors.entries()).reduce(
    (acc, [author, count]) => (count > acc[1] ? [author, count] : acc),
    [null, 0]
  );

  return {
    author: mostBlogAuthor[0],
    blogs: mostBlogAuthor[1],
  };
};

const mostLikes = (blogs) => {
  const authors = new Map();
  blogs.forEach((blog) => {
    authors.set(blog.author, (authors.get(blog.author) || 0) + blog.likes);
  });

  const mostLikedAuthor = Array.from(authors.entries()).reduce(
    (acc, [author, likes]) => (likes > acc[1] ? [author, likes] : acc),
    [null, 0]
  );

  return {
    author: mostLikedAuthor[0],
    likes: mostLikedAuthor[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
