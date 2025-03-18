import { gql } from 'apollo-server-express';

const typeDefs = gql`
  # Define User type
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  # Define Book type
  type Book {
    bookId: String!
    authors: [String]
    title: String!
    description: String
    image: String
    link: String
  }

  # Define Auth type
  type Auth {
    token: ID!
    user: User
  }

  # Input type for saving a book
  input BookInput {
    bookId: String!
    authors: [String]
    title: String!
    description: String
    image: String
    link: String
  }

  # Query type
  type Query {
    me: User
  }

  # Mutation type
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;
