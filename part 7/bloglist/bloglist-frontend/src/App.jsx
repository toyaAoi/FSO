import { useEffect } from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import Notification from "./components/Notification";
import {
  initializeUser,
  useUserDispatch,
  useUserValue,
} from "./reducers/userReactReducer";
import UsersTable from "./components/UsersTable";
import User from "./components/User";
import usersService from "./services/users";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import Nav from "./components/Nav";

const App = () => {
  const user = useUserValue();

  const { data: blogUsers } = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getAll,
    refetchOnWindowFocus: false,
  });

  const { data: blogs } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  const userDispatch = useUserDispatch();

  useEffect(() => {
    initializeUser(userDispatch);
  }, [userDispatch]);

  const matchedUser = useMatch("/users/:id");
  const blogUser =
    matchedUser && blogUsers
      ? blogUsers.find((user) => user.id === matchedUser.params.id)
      : null;

  const matchedBlog = useMatch("/blogs/:id");
  const blog =
    matchedBlog && blogs
      ? blogs.find((blog) => blog.id === matchedBlog.params.id)
      : null;

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {user && <Nav user={user.name} />}
      <h1 className="text-3xl font-bold underline m-8 text-center">blogs</h1>
      <Notification />
      <LoginForm user={user} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {user && <BlogForm />}
              {user && <BlogList blogs={blogs} />}
            </>
          }
        />
        <Route path="/blogs/:id" element={<Blog blog={blog} />} />

        <Route
          path="/users"
          element={user && blogUsers && <UsersTable users={blogUsers} />}
        />
        <Route path="/users/:id" element={<User user={blogUser} />} />
      </Routes>
    </div>
  );
};

export default App;
