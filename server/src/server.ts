import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import {typeDefs, resolvers} from './schemas'

import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
//import routes from './routes/index.js';
import http from 'http';

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

interface MyContext {
  token?: string;
}

const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//app.use(routes);

app.use(
  '/',
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);



db.once('open', async () => {

  //app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );
  console.log(`🌍 Now listening on localhost:${PORT}`)
});
