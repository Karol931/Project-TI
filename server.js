const express = require("express");
const app = express();
const path = require("path");
const client = require("./db.js");
const db = client.db;
const User = require("./models/user");
const Game = require("./models/game");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
let fname;
let lname;

app.get("/", async (req, res) => {
  try {
    let checkUser = await User.find({
      fname: req.query.fname,
      lname: req.query.lname,
    }).count();
    if (checkUser != 0) {
      fname = req.query.fname;
      lname = req.query.lname;
      res.render("index", {
        text: "Witaj " + req.query.fname + " " + req.query.lname,
        buttonText: "Wyloguj się",
        isLoggedIn: true,
      });
    } else {
      res.render("index", {
        text: "",
        buttonText: "Zaloguj się",
        isLoggedIn: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/", async (req, res) => {
  try {
    if (typeof req.body.points.length === "undefined") {
      let points = req.body.points;
      let speed = req.body.speed;
      let angle = req.body.angle;
      let isInBasket = req.body.isInBasket;
      const game = new Game({
        points: points,
        speed: speed,
        angle: angle,
        isInBasket: isInBasket,
      });
      await game.save();
      let id = game._id;
      await User.findOneAndUpdate(
        { fname: fname, lname: lname },
        { $push: { gameID: id } }
      );
    } else {
      for (let i = 0; i < req.body.points.length; i++) {
        let points = req.body.points[i];
        let speed = req.body.speed[i];
        let angle = req.body.angle[i];
        let isInBasket = req.body.isInBasket[i];
        const game = new Game({
          points: points,
          speed: speed,
          angle: angle,
          isInBasket: isInBasket,
        });
        await game.save();
        let id = game._id;
        await User.findOneAndUpdate(
          { fname: fname, lname: lname },
          { $push: { gameID: id } }
        );
      }
      let str = fname + "&lname=" + lname;
      res.redirect("/?fname=" + str);
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/login", (req, res) => {
  if (req.query.valid === "BrakDanych") {
    res.render("login", { text: "Imie i nazwisko nie mogą być puste" });
  } else if (req.query.valid === "BrakUzytkownika") {
    res.render("login", { text: "Błędne dane użytkownika" });
  } else {
    res.render("login", { text: "" });
    lname = "";
    fname = "";
  }
});

app.post("/login", async (req, res) => {
  if (req.body.fname != "" && req.body.lname != "") {
    try {
      let checkUser = await User.find({
        fname: req.body.fname,
        lname: req.body.lname,
      }).count();
      if (checkUser != 0) {
        let str = req.body.fname + "&lname=" + req.body.lname;
        res.redirect("/?fname=" + str);
      } else {
        let str = "BrakUzytkownika";
        res.redirect("/login/?valid=" + str);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    let str = "BrakDanych";
    res.redirect("/login/?valid=" + str);
  }
});

app.get("/register", (req, res) => {
  if (req.query.valid === "BrakDanych") {
    res.render("register", { text: "Imie i nazwisko nie mogą być puste" });
  } else if (req.query.valid === "UzytkownikIstnieje") {
    res.render("register", {
      text: "Użytkownik o podanych danych już istnieje",
    });
  } else {
    res.render("register", { text: "" });
  }
});

app.post("/register", async (req, res) => {
  try {
    if (req.body.fname != "" && req.body.lname != "") {
      let checkUser = await User.find({
        fname: req.body.fname,
        lname: req.body.lname,
      }).count();
      if (checkUser === 0) {
        const user = new User({
          fname: req.body.fname,
          lname: req.body.lname,
        });
        await user.save();
        res.status(201);
        res.redirect("/login");
      } else {
        let str = "UzytkownikIstnieje";
        res.redirect("/register/?valid=" + str);
      }
    } else {
      let str = "BrakDanych";
      res.redirect("/register/?valid=" + str);
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/results", async (req, res) => {
  try {
    let checkUser = await User.find({ fname: fname, lname: lname }).count();
    if (checkUser != 0) {
      let gameIDs = await User.findOne(
        { fname: fname, lname: lname },
        { gameID: 1, _id: 0 }
      );
      gameIDs = gameIDs.gameID;
      let games = [];
      for (let i = 0; i < gameIDs.length; i++) {
        games[i] = await Game.findOne({ _id: gameIDs[i] });
      }
      let url = "/?fname=" + fname + "&lname=" + lname;
      res.render("results", { games: games, url: url });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
