const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;
//let airportsObj;

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//console.log(routes);

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

// Add routes, both API and view
app.use(routes);

// app.get("/", (req, res) =>
//   res.send(
//     "Hello Modupe! This route in server works!!! Errors must be from controllers or routes."
//   )
// );
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });
// Connect to the Mongo DB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/travelrushers", {
    useNewUrlParser: true
  })
  .then(() => console.log("Successfully connected to travelrushers database!"))
  .catch(err => console.log(err));

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});