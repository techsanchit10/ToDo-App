const mongoose = require('mongoose');

module.exports.dbConnection = mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("Error Connecting to DB: ", err));

