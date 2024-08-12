import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("blog details passed before submitting", async () => {
  const createBlog = vi.fn();
  render(<BlogForm createBlog={createBlog} />);
  const user = userEvent.setup();
  const title = screen.getByPlaceholderText("enter blog title");
  const author = screen.getByPlaceholderText("enter author name");
  const url = screen.getByPlaceholderText("enter url");
  const button = screen.getByText("create");

  await user.type(title, "test title");
  await user.type(author, "test author");
  await user.type(url, "test.url");
  await user.click(button);
  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: "test title",
    author: "test author",
    url: "test.url",
  });
});

