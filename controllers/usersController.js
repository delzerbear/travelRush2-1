const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Defining methods for the booksController
module.exports = {
  testAll: function(req, res) {
    // if (err) {
    //   res.status(422).json(err);
    // }
    res.json({ msg: "The user controller works." });
  },
  // findAll: function(req, res) {
  //   db.User.find(req.query)
  //     .then(dbUser => res.json(dbUser))
  //     .catch(err => res.status(422).json(err));
  // },
  //This method handles the login request.
  findUser: function(req, res) {
    console.log("Here is the body of the request......");
    console.log(req.body);
    const { email, password } = req.body;
    const { errors, isValid } = validateLoginInput(req.body);
    console.log("Errors are ");
    console.log(errors);
    console.log("isValid status is " + isValid);
    // Perform initial validation on user inputs for login
    if (!isValid) {
      console.log("Validating user inputs for login.....");
      return res.status(400).json({ errors, isValid });
    }

    db.User.findOne({ email })
      .then(dbUser => {
        if (!dbUser) {
          errors.email = "User not found";
          return res.json({ email: errors.email });
        }
        //Check Password.
        bcrypt.compare(password, dbUser.password).then(isMatch => {
          if (isMatch) {
            //User Matched(Set the info(use payload) the user can get from the jwt token)
            const payload = {
              id: dbUser._id,
              name: dbUser.name,
              email: dbUser.email
            };
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: "1h" },
              (err, token) => {
                res.json({ success: true, token: "Bearer " + token });
              }
            );
            //res.json({ msg: "Success" });
          } else {
            errors.password = "Password is incorrect";
            return res.json({ password: errors.password });
          }
        });
      })
      .catch(err => res.status(422).json(err));
  },

  // findByName: function(req, res) {
  //   //Not sure if name would come from req.params*****************
  //   db.User.findByOne({ name: req.params.name })
  //     .then(dbUser => res.json(dbUser))
  //     .catch(err => res.status(422).json(err));
  // },

  // findById: function(req, res) {
  //   db.User.findById(req.params.id)
  //     .then(dbUser => res.json(dbUser))
  //     .catch(err => res.status(422).json(err));
  // },
  //************Do validation in route before saving new user ******************/
  //Helper function is used to validate email.
  // isValidEmail: function(email) {
  //   //validation code for email
  //   let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return re.test(String(email).toLowerCase());
  // },

  //This method handles signing up/registering users.
  createUser: function(req, res) {
    console.log(req.body);
    const { errors, isValid } = validateRegisterInput(req.body);
    console.log("Errors are ");
    console.log(errors);
    console.log("isValid status is " + isValid);
    // Check Validation on user inputs during registration
    if (!isValid) {
      console.log("Validating user input for signup.....");
      return res.status(400).json(errors);
    }
    const { name, email, password, address } = req.body;
    console.log(req.body);

    //check whether email is in the database.
    db.User.findOne({ email: email })
      .then(dbUser => {
        console.log(dbUser);
        if (dbUser) {
          //email already exist in the database, so send appropriate message.
          //res.json({ success: false, message: "Account already exist." });
          errors.email = "Email already exists";
          return res.json({ email: errors.email });
        }

        //save the new user
        const newUser = new db.User({
          name: name,
          email: email,
          password: password,
          address: address
        });
        // console.log("TEST");

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                //create favorites model to hold user's favs.
                const newFav = new db.Favorite();
                newFav.owner = user._id;
                //save favorite model with user's id.
                newFav
                  .save()
                  .then(favorite => console.log(favorite))
                  .catch(err => console.log(err));
                res.json({
                  Success: true,
                  msg: "Account successfully created."
                });
              })
              .catch(err => console.log(err));
          });
        });
        // newUser.name = name;
        // newUser.email = email;
        // newUser.password = password;
        // //newUser.password = newUser.generateHash(password);
        // newUser.address = address;

        // newUser.save((err, user) => {
        //   if (err) {
        //     res.json({ success: false, message: "Server error" });
        //   }
        //   res.json({ success: true, message: "Signed up!" });
        // });
      })
      .catch(err =>
        res.status(422).send("mongoose error: Error in findOne() block")
      );
  },

  // updateUser: function(req, res) {
  //   db.User.findOneAndUpdate({ _id: req.params.id }, req.body)
  //     .then(dbUser => res.json(dbUser))
  //     .catch(err => res.status(422).json(err));
  // },
  // deleteUser: function(req, res) {
  //   db.User.deleteOne({ _id: req.params.id })
  //     // .then(dbModel => dbModel.remove())
  //     .then(dbUser => res.json(dbUser))
  //     .catch(err => res.status(422).json(err));
  // },
  getUserInfo: function(req, res) {
    console.log(req.user);
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
    //res.json({ msg: "Success!" });
    //console.log("Success!");
  },

  //save favorites for a specific user***MAY NOT NEED THIS!!!
  // createFavorites: function(req, res) {
  //   //req should include favorite item and userid
  //   const { hotel, restaurant, coffee, owner } = req.body;
  //   const newFav = new db.Favorite();
  //   newFav.hotel.push(hotel);
  //   newFav.restaurant.push(restaurant);
  //   newFav.coffee.push(coffee);
  //   newFav.owner.push(owner);
  //   newFav
  //     .save()
  //     .then(favorites => {
  //       console.log(favorites);
  //     })
  //     .catch(err => console.log(err));
  // },

  //update favorites for a specific user
  updateFavorites: function(req, res) {
    console.log("I am inside the function to update favorite....");
    const { owner, category, name, url, price, distance, location } = req.body;
    console.log(req.body);
    // const searchField = category;
    // const newUpdate = { category: name, url, price, distance };
    db.Favorite.findOneAndUpdate(
      { owner: owner },
      {
        $push: {
          [category]: {
            name: name,
            url: url,
            price: price,
            distance: distance,
            location: location
          }
        }
      },
      { new: true }
    )
      .then(favorites => {
        //PUSH IS NOT HAPPENING WHY??!!!.................................................
        console.log(favorites);
      })
      .catch(err => console.log(err));
  },

  //populate user with corresponding favorites
  getFavorites: function(req, res) {
    console.log("I am inside the function to get user's favorites...");
    //const { owner } = req.params;
    console.log(req.params);
    db.Favorite.findOne({ owner: req.params.id })
      .then(dbFave => {
        console.log(dbFave);
        res.json(dbFave);
      })
      .catch(err => console.log(err));
  },

  //delete favorites for a specific user
  deleteFavorites: function(req, res) {
    //
  }
};

//HOW TO CREATE A MODEL ONCE WITH insertMany()

// if (name && email && address && password && isValidEmail(email)) {
//   db.User.create(req.body)
//     .then(dbUser => res.json(dbUser))
//     .catch(err => res.status(422).json(err));
// }

// Kitten.find(function (err, kittens) {
//   if (err) return console.error(err);
//   console.log(kittens);
// })
