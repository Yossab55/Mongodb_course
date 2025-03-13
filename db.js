const { MongoClient } = require("mongodb");
let dbConnection;
module.exports = {
  // callback here after connection what do want to do 
  // listen to app 
  connectToDb: (callback) => {
    // connect with local mongodb
    //* local connection
    // MongoClient.connect("mongodb://localhost:27017/bookstore")
    //* cloud connection
    MongoClient.connect(
      "mongodb+srv://yossabpro5:<db_password>@cluster0.fwyba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
      //! change <db_password> to your db_password
      //! /<add your db name>?retryWrites=true&w=majority&appName=Cluster0"
      .then((clint) => {
        dbConnection = clint.db();
        return callback();
      })
      .catch((err) => {
        console.log(err);
        return callback(err);
      });
  },
  getDb: () => dbConnection,
};
