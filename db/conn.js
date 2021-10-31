const mongoose = require("mongoose");

const DB =process.env.DATABASE;


mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: true,
  })
  .then(() => {
    console.log("Connection is successfull to the --Atlas Database-- 🔥");
  })
  .catch((e) => {
    console.log(`Connection Failed ${e}`);
  });
