const typeDefs = `
type Query {
  me: User
}

type User {
  _id: ID!
  username: String!
  email: String!
  bookCount: Int
  savedBooks: [Book]
}

type Book {
  bookId: String!
  authors: [String]
}
`;
export default typeDefs;