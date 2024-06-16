const loginWith = async (page, username, password) => {
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "create new blog" }).click();
  await page.getByPlaceholder("enter blog title").fill(title);
  await page.getByPlaceholder("enter author name").fill(author);
  await page.getByPlaceholder("enter url").fill(url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByText(`a new blog ${title} by ${author} added`).waitFor();
};

module.exports = { loginWith, createBlog };
