import PropTypes from "prop-types";

import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
  if (!blogs) {
    return;
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <>
      {sortedBlogs.map((blog) => (
        <Link key={blog.id} to={"blogs/" + blog.id} className="blog-link">
          {blog.title}
        </Link>
      ))}
    </>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.array,
};

export default BlogList;
