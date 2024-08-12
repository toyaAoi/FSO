import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    title: "test title",
    author: "test author",
  };
  render(<Blog blog={blog} />);
  const title = screen.getByText("test title");
  const author = screen.getByText("test author");
  // const author = div.querySelector(".author");

  expect(title).toBeDefined();
  expect(author).toBeDefined();
});

test("clicking the button renders extra content", async () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test.url",
    likes: 0,
  };

  const { container } = render(<Blog blog={blog} />);
  const user = userEvent.setup();
  const blogDetails = container.querySelector(".togglable");
  const button = screen.getByText("view");

  expect(blogDetails).toHaveStyle("display: none");

  await user.click(button);

  expect(blogDetails).not.toHaveStyle("display: none");
});

test("clicking the button twice calls event handler twice", async () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test.url",
    likes: 0,
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} addLikes={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  const addLike = screen.getByText("like");

  await user.click(button);

  await user.click(addLike);
  await user.click(addLike);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
