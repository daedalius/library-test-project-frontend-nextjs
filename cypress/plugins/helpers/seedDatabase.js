const fetch = require("isomorphic-fetch");

const fetchUri = `http://127.0.0.1:${3000}`;

module.exports = async function () {
  let cookie = null;
  await fetch(fetchUri + "/reset", {
    method: "POST",
  });

  // User registration
  const response = await fetch(fetchUri + "/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      login: "admin",
      password: "password",
      avatarUrl:
        "https://img.wattpad.com/useravatar/DannaMendoza372.128.250070.jpg",
      role: "librarian",
    }),
  });
  cookie = response.headers.get("Set-Cookie").split(";")[0].split("=")[1];
  const user = await response.json();

  const authors = await (
    await fetch(fetchUri + "/authors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-id=${cookie}`,
      },
      body: JSON.stringify([
        {
          name: "G. K. Chesterton",
        },
        {
          name: "William Shakespeare",
        },
        {
          name: "Leo Tolstoy",
        },
      ]),
    })
  ).json();

  const books = await (
    await fetch(fetchUri + "/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-id=${cookie}`,
      },
      body: JSON.stringify([
        {
          title: "The Man Who Was Thursday",
          description:
            "The book has been described as a metaphysical thriller.",
          coverUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Chesterton_-_The_Man_Who_Was_Thursday.djvu/page1-377px-Chesterton_-_The_Man_Who_Was_Thursday.djvu.jpg",
          authorIds: [authors[0].id],
        },
        {
          title: "Venus and Adonis",
          description:
            "Venus and Adonis is a narrative poem by William Shakespeare published in 1593. It is probably Shakespeare`s first publication.",
          coverUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Venus_and_Adonis_quarto.jpg/220px-Venus_and_Adonis_quarto.jpg",
          authorIds: [authors[1].id],
        },
        {
          title: "War and peace",
          description:
            "It is a literary work mixed with chapters on history and philosophy by the Russian author Leo Tolstoy, first published serially, then published in its entirety in 1869. It is regarded as one of Tolstoy`s finest literary achievements and remains an internationally praised classic of world literature.",
          coverUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tolstoy_-_War_and_Peace_-_first_edition%2C_1869.jpg/220px-Tolstoy_-_War_and_Peace_-_first_edition%2C_1869.jpg",
          authorIds: [authors[2].id],
        },
      ]),
    })
  ).json();

  const bookCopies = await (
    await fetch(fetchUri + "/copies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-id=${cookie}`,
      },
      body: JSON.stringify([
        {
          bookId: books[0].id,
        },
      ]),
    })
  ).json();

  const comment_one = await (
    await fetch(fetchUri + "/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-id=${cookie}`,
      },
      body: JSON.stringify({
        bookId: books[0].id,
        userId: user.id,
        text: "I'm not big into books",
      }),
    })
  ).json();

  const comment_two = await (
    await fetch(fetchUri + "/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-id=${cookie}`,
      },
      body: JSON.stringify({
        bookId: books[0].id,
        userId: user.id,
        text: "LMAO",
      }),
    })
  ).json();

  return cookie;
};
