import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path' 
import router from './routes/index.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { connectDB } from './config/connection.js';

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Initialize Apollo Server
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// // Start Apollo Server
// async function startApolloServer() {
//   await server.start();

//   // Apply Apollo middleware to Express
//   app.use(
//     '/graphql',
//     json(),
//     expressMiddleware(server, {
//       context: async ({ req }: { req: express.Request }) => {
//         const token = req.headers.authorization;
//         // Mock user object for demonstration; replace with actual user retrieval logic
//         const user = { _id: token ? 'mockUserId' : null };
//         return { user };
//       },
//     })
//   );

//   app.use(express.urlencoded({ extended: true }));
//   app.use(express.json());

//   // if we're in production, serve client/build as static assets
//   if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/build')));
//   }

//   app.use(routes);

//   db.once('open', () => {
//     app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
//   });
// }

// startApolloServer();
// ✅ Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// ✅ Start Apollo Server and MongoDB connection
async function startApolloServer() {
  await connectDB(); // Ensure connectDB is a callable function
  await server.start();

  app.use(
    '/graphql',
    cors({
      origin: 'http://localhost:3000', // Allow requests from the client
      credentials: true, // Allow cookies and credentials
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: express.Request }) => {
        const token = req.headers.authorization || '';
        const user = token ? { _id: 'mockUserId' } : { _id: null }; // Ensure user always has an _id property
        return { user };
      },
    })
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // ✅ Serve React production build from the correct path
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.use(router);

  app.listen(PORT, () => {
    console.log(`🌍 API server running on port ${PORT}!`);
    console.log(`🚀 Use GraphQL at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();