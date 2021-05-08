import app from "./app";

import { connect } from "mongoose";

connect(
  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server listening on ${process.env.PORT}`)
    );
  })
  .catch(console.error);
