import { createSlice } from "@reduxjs/toolkit";
import blogServices from "../services/blogs";
import { createNotification } from "./notificationReactReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    editBlog(state, action) {
      const id = action.payload.id;
      const blog = state.find((blog) => blog.id === id);
      const newBlog = { ...blog, ...action.payload };

      return state.map((blog) => (blog.id !== id ? blog : newBlog));
    },
    deleteOne(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { setBlogs, addBlog, editBlog, deleteOne } = blogSlice.actions;

// export const initializeBlogs = () => async (dispatch) => {
//   const blogs = await blogServices.getAll();
//   dispatch(setBlogs(blogs));
// };

// export const createBlog = (blog, notificationDispatch) => async (dispatch) => {
//   try {
//     const newBlog = await blogServices.create(blog);
//     dispatch(addBlog(newBlog));
//     notificationDispatch(
//       createNotification(
//         `a new blog ${newBlog.title} by ${newBlog.author} added`,
//         "success",
//         5
//       )
//     );
//   } catch (error) {
//     notificationDispatch(
//       createNotification(error.response.data.error, "error", 5)
//     );
//   }
// };

export const deleteBlog = (blog, notificationDispatch) => async (dispatch) => {
  try {
    await blogServices.remove(blog.id);
    dispatch(deleteOne(blog.id));
    notificationDispatch(
      createNotification(
        `Blog ${blog.title} by ${blog.author} deleted`,
        "success",
        5
      )
    );
  } catch (error) {
    notificationDispatch(
      createNotification(error.response.data.error, "error", 5)
    );
  }
};

export const addLike = (blog, notificationDispatch) => async (dispatch) => {
  try {
    const updatedBlog = await blogServices.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
    dispatch(editBlog(updatedBlog));
  } catch (error) {
    notificationDispatch(
      createNotification(error.response.data.error, "error", 5)
    );
  }
};

export default blogSlice.reducer;
