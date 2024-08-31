const { GraphQLError, subscribe } = require("graphql");
const jwt = require("jsonwebtoken");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const User = require("./models/user");
const Author = require("./models/author");
const Book = require("./models/book");

const resolvers = {
  Query: {
    authorCount: async () => await Author.countDocuments(),
    bookCount: async () => await Book.countDocuments(),
    allBooks: async (_root, args) => {
      console.log("Requested All Books");

      if (!args.author && !args.genre) {
        console.log("No filter provided");
        const books = await Book.find().populate("author");
        return books;
      }

      if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author });
        const books = await Book.find({
          author: author._id,
          genres: { $in: [args.genre] },
        }).populate("author");

        return books;
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author });

        const books = await Book.find({
          author: author._id,
        }).populate("author");
        return books;
      }

      if (args.genre) {
        const books = await Book.find({
          genres: { $in: [args.genre] },
        }).populate("author");

        return books;
      }

      console.log("Reached the end of the function");
      return [];
    },
    allAuthors: async () => {
      const authors = await Author.find();
      authors.forEach((author) => (author.bookCount = author.books.length));
      console.log(authors);
      return authors;
    },
    me: ({ currentUser }) => currentUser,
  },
  Mutation: {
    addBook: async (_root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("login required", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = await Author.create({ name: args.author });
      }

      const book = new Book({
        ...args,
        author,
      });

      let newBook;

      try {
        const addedBook = await book.save();
        await author.updateOne({ $push: { books: addedBook._id } });

        const bookCount = await Book.find({ author });

        newBook = {
          id: addedBook._id.toString(),
          title: addedBook.title,
          published: addedBook.published,
          genres: addedBook.genres,
          author: {
            name: author.name,
            id: author._id.toString(),
            bookCount: bookCount.length,
          },
        };
      } catch (error) {
        throw new GraphQLError("creating book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: newBook });
      return newBook;
    },

    editAuthor: async (_root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("login required", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (author) {
        try {
          author.born = args.setBornTo;
          await author.save();

          const bookCount = await Book.countDocuments({ author: author._id });

          return { ...author.toObject(), born: args.setBornTo, bookCount };
        } catch (error) {
          throw new GraphQLError("updating person failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args,
              error,
            },
          });
        }
      } else {
        return null;
      }
    },

    createUser: (_root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("User creation failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      });
    },
    login: async (_root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
