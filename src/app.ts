import express from "express";
import { graphqlHTTP } from "express-graphql";

import graphqlSchema from "./graphql/schema";
import graphqlResolver from "./graphql/resolvers";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn: (err) => {
      if (!err.originalError) {
        return err;
      }
      const data = (err.originalError as any).data;
      const message = err.message || `An error occured`;
      const code = (err.originalError as any).code || 500;

      return { message, status: code, data: data };
    },
  })
);

export default app;
