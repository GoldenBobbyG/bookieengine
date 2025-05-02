import express, { json } from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
// import { json } from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
async function startApolloServer() {
  await server.start();

  // Apply Apollo middleware to Express
  app.use(
    '/graphql',
    json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: express.Request }) => {
        const token = req.headers.authorization;
        // Mock user object for demonstration; replace with actual user retrieval logic
        const user = { _id: token ? 'mockUserId' : null };
        return { user };
      },
    })
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
}

startApolloServer();
