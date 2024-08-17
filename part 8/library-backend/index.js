const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log("🤖  connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("🐸  Connected to mongodb");
  })
  .catch((error) => {
    console.error("👾  error connecting to mongodb: ", error.message);
  });

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int
    author: Author!
    id: ID!
    genres: [String]
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    authorCount: async () => await Author.countDocuments(),
    bookCount: async () => await Book.countDocuments(),
    allBooks: async (_root, args) => {
      if (!args.author && !args.genre) {
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

      return [];
    },
    allAuthors: async () => {
      const authors = await Author.find();
      return authors;
    },
  },
  Mutation: {
    addBook: async (_root, args) => {
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = await Author.create({ name: args.author });
      }

      const book = new Book({
        ...args,
        author,
      });

      try {
        const addedBook = await book.save();
        const bookCount = await Book.find({ author });

        return {
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
    },

    editAuthor: async (_root, args) => {
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
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
