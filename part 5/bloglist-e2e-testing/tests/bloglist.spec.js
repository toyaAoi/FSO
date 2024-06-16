const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const username = await page.getByText("username");
    const password = await page.getByText("password");
    await expect(username).toBeVisible();
    await expect(
      username.getByRole("textbox", { name: "username" })
    ).toBeVisible();
    await expect(password).toBeVisible();
    await expect(
      password.getByRole("textbox", { name: "password" })
    ).toBeVisible();
  });

  describe("Login", () => {
    beforeEach(async ({ request }) => {
      await request.post("/api/users", {
        data: {
          username: "toyaAoi",
          name: "Toya Aoi",
          password: "atohasecret",
        },
      });
      await request.post("/api/users", {
        data: {
          username: "HACKER",
          name: "Hacker",
          password: " h4ck3r  ",
        },
      });
    });

    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "toyaAoi", "atohasecret");
      await expect(page.getByText("Toya Aoi logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "toyaAoi", "wrong");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("wrong username or password")).toBeVisible();
    });

    describe("when logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, "toyaAoi", "atohasecret");
      });

      test("a blog can be liked", async ({ page }) => {
        await createBlog(page, "first blog", "toyaAoi", "www.blog.com");
        await page
          .getByText("first blog")
          .getByRole("button", { name: "view" })
          .click();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 2")).toBeVisible();
      });

      test("a blog can be deleted", async ({ page }) => {
        await createBlog(page, "first blog", "toyaAoi", "www.blog.com");
        await page
          .getByText("first blog")
          .getByRole("button", { name: "view" })
          .click();
        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();
        await expect(page.getByText("deleted")).toBeVisible();
        await expect(
          page.locator(".blog").getByText("first blog")
        ).not.toBeVisible();
      });

      test("a blog can only be deleted by its creator", async ({ page }) => {
        await createBlog(page, "first blog", "toyaAoi", "www.blog.com");
        await page.getByRole("button", { name: "logout" }).click();

        await loginWith(page, "HACKER", " h4ck3r  ");
        await page
          .getByText("first blog")
          .getByRole("button", { name: "view" })
          .click();
        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();
        await expect(
          page.getByText("only the user who created this blog can delete")
        ).toBeVisible();
        await expect(
          page.locator(".blog").getByText("first blog")
        ).toBeVisible();

        await page.getByRole("button", { name: "logout" }).click();

        await loginWith(page, "toyaAoi", "atohasecret");
        await page
          .getByText("first blog")
          .getByRole("button", { name: "view" })
          .click();
        await page.getByRole("button", { name: "remove" }).click();

        page.on("dialog", async (dialog) => await dialog.accept());
        await expect(page.getByText("deleted")).toBeVisible();
        await expect(
          page.locator(".blog").getByText("first blog")
        ).not.toBeVisible();
      });

      test("blogs are ordered according to likes", async ({ page }) => {
        await createBlog(page, "first blog", "toyaAoi", "www.blog.com");
        await createBlog(page, "second blog", "toyaAoi", "www.blog.com");
        await createBlog(page, "third blog", "toyaAoi", "www.blog.com");

        const firstBlog = await page.getByText("first blog");

        const secondBlog = await page.getByText("second blog");

        const thirdBlog = await page.getByText("third blog");

        await firstBlog.getByRole("button", { name: "view" }).click();
        await secondBlog.getByRole("button", { name: "view" }).click();
        await thirdBlog.getByRole("button", { name: "view" }).click();

        await thirdBlog.getByRole("button", { name: "like" }).click();
        await thirdBlog.getByRole("button", { name: "like" }).click();
        await thirdBlog.getByText("likes 2").waitFor();

        await secondBlog.getByRole("button", { name: "like" }).click();
        await secondBlog.getByText("likes 1").waitFor();

        const blogs = await page.locator(".blog");
        await expect(blogs.nth(0)).toContainText("third blog");
        await expect(blogs.nth(1)).toContainText("second blog");
        await expect(blogs.nth(2)).toContainText("first blog");
      });
    });
  });
});
