var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
// var authController = require("./auth");
var authJwtController = require("./auth_jwt");
var jwt = require("jsonwebtoken");
var cors = require("cors");
var User = require("./Users");
var Places = require("./Places");
var Itinerary = require("./Itinerary");
var Posts = require("./Posts")
const mongoose = require("mongoose");


var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

router.post("/signup", function (req, res) {
    if (!req.body.username || !req.body.password) {
      res.json({
        success: false,
        msg: "Please include both username and password to signup.",
      });
    } else {
      var user = new User();
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;
  
      user.save(function (err) {
        if (err) {
          if (err.code == 11000)
            return res.json({
              success: false,
              message: "A user with that username already exists.",
            });
          else return res.json(err);
        }
  
        res.json({ success: true, msg: "Successfully created new user." });
      });
    }
  });

  router.put("/signup/:username", function (req, res) {
    const currentUser = req.params.username;
    const { biography, imageUrl, hobby, placesToVisit, placesVisited } = req.body;
  
    User.findOneAndUpdate(
      { username: currentUser },
      { biography, imageUrl, hobby, placesToVisit, placesVisited },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          res.status(400).send(err);
        } else if (!updatedUser) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json(updatedUser);
        }
      }
    );
  });
  
  
  router.post("/signin", function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;
  
    User.findOne({ username: userNew.username })
      .select("name username password")
      .exec(function (err, user) {
        if (err) {
          res.send(err);
        }
  
        if (!user) {
          // User not found in the database
          res.status(401).send({ success: false, msg: "Authentication failed." });
          return;
        }
  
        user.comparePassword(userNew.password, function (isMatch) {
          if (isMatch) {
            var userToken = { id: user.id, username: user.username };
            var token = jwt.sign(userToken, process.env.SECRET_KEY);
            res.json({ success: true, token: "JWT " + token });
          } else {
            res
              .status(401)
              .send({ success: false, msg: "Authentication failed." });
          }
        });
      });
  });
  
  router
  .route("/places")
  .get((req, res) => {
    Places.find(
        {
            city: { $exists: true, $ne: null },
            country: { $exists: true, $ne: null },
            continent: { $exists: true, $ne: null },
            imageUrl: { $exists: true, $ne: null }
        },
        (err, places) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).json(places);
            }
        }
    )
})

router.route("/itinerary").get((req, res) => {
  Itinerary.find({
      $and: [
          { _id: {$exists: true, $ne: null }},
          { imageUrl: { $exists: true, $ne: null } },
          { title: { $exists: true, $ne: null } },
          { location: { $exists: true, $ne: null } },
          { category: { $exists: true, $ne: null } },
          { itinerary: { $exists: true, $ne: null } }
      ]
  }, (err, itineraries) => {
      if (err) {
          res.status(400).send(err);
      } else {
          res.status(200).json(itineraries);
      }
  });
});

router.route("/itinerary/:id").get((req, res) => {
  const itineraryId = req.params.id;
  Itinerary.find({ _id: itineraryId }, (err, itinerary) => {
    if (err) {
      res.status(400).send(err);
    } else if (itinerary.length === 0) {
      res.status(404).json({ error: "Itinerary not found" });
    } else {
      res.status(200).json(itinerary);
    }
  });
});


router.route("/posts").get((req, res) => {
  Posts.find({
      $and: [
          { name: { $exists: true, $ne: null } },
          { location: { $exists: true, $ne: null } },
          { content: { $exists: true, $ne: null } },
          { date: { $exists: true, $ne: null } },
      ]
  }, (err, posts) => {
      if (err) {
          res.status(400).send(err);
      } else {
          res.status(200).json(posts);
      }
  });
})

router.route("/posts").post((req, res) => {
  const { name, location, image, content } = req.body;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  // Validate required fields
  if (!name || !location || !content || !image) {
      return res.status(400).json({ message: "All fields are required." });
  }

  const newPost = new Posts({
      name,
      location,
      image,
      content,
      likes: 0,
      date: today
  });

  newPost.save((err, post) => {
      if (err) {
          return res.status(400).send(err);
      }
      res.status(201).json(post);
  });
});

router.route("/profile/:username")
  .get((req, res) => {
    const { username } = req.params;
    User.findOne({ username })
      .populate('placesToVisit.placeId')
      .populate('placesVisited.placeId')
      .exec((err, user) => {
        if (err) {
          res.status(400).send(err);
        } else if (!user) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json(user);
        }
      });
  });




app.use("/", router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only
