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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

// Start the server only after database connection is established
db.once('open', () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌍 Now listening on port ${PORT}`);
    console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // In production, we might want to exit the process on uncaught exceptions
  if (process.env.NODE_ENV === 'production') {
    console.error('Fatal: Uncaught exception in production environment.');
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, we might want to exit the process on unhandled rejections
  if (process.env.NODE_ENV === 'production') {
    console.error('Fatal: Unhandled rejection in production environment.');
    process.exit(1);
  }
});
