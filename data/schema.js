import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const SchemaDefinition = `
  type Query {
    userQuery(accessToken: String!): User
    sessionQuery(userId: String!, accessToken: String!): Session
  }
  type Session {
    accessToken: String!
    accessTokenExpiresAt: String!
    refreshToken: String
    refreshTokenExpiresAt: String
    scope: String
    client: Client
    user: User
  }
  type Client {
    clientId: String!
    clientSecret: String
    redirectUris: [String]
    grants: [String]
  }
  type User {
    username: String!
    fullName: String
  }
  type Mutation {
    editFullName (
      accessToken: String!
      fullName: String!
    ): User
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
  typeDefs: [SchemaDefinition],
  resolvers,
});
