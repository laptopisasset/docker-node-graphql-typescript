import express from "express";
import { graphqlHTTP } from "express-graphql";

import graphqlSchema from "./graphql/schema";
import graphqlResolver from "./graphql/resolvers";

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

export default app;
