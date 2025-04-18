import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateGraphQL, type GraphQLContext } from './services/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Apply middleware before routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create Apollo Server
const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  formatError: (error) => {
    // Log the error for debugging
    console.error('GraphQL Error:', error);
    return error;
  },
});

// Start Apollo Server
await server.start();

// Create context function with explicit typing
const createContext = async (contextParams: { req: express.Request }): Promise<GraphQLContext> => {
  const context: GraphQLContext = { request: contextParams.req };
  return authenticateGraphQL(context);
};

// Apply Apollo middleware with CORS enabled
app.use('/graphql', expressMiddleware(server, { context: createContext }));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

db.once('open', () => {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`🌍 Now listening on port ${PORT}`);
  });
});
