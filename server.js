require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const morgan = require('morgan'); // used to see requests
const db = require('./models');
const PORT = process.env.PORT || 3001;

const isAuthenticated = require("./config/isAuthenticated");
const auth = require("./config/auth");

// Setting CORS so that any website can
// Access our API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

//log all requests to the console
app.use(morgan('dev'));

// Setting up express to use json and set it to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appDB', { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.error(err));
//get all news articles from the database 
app.get("/api/articles", (req, res) => {
  db.Article
    .find({}).limit(12)
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err))
})
//save an article
app.post("/api/articles/:articleId", (req, res) => {
  console.log("worked")
  db.Article
    .findOneAndUpdate({_id: req.params.articleId}, {saved: true}, {new: true})
    .then(dbArticle => res.json(dbArticle))
});
//Get saved articles for the profile page
app.get("/saved", (req, res) => {
  db.Article
    .find({saved: true})
    .then(dbArticles => res.json(dbArticles))
})
//SCRAPE route
const cheerio = require("cheerio")
const axios = require("axios")
app.get("/scrape", (req, res) => {
//  axios.get("https://pokemongolive.com/en/post/").then(function(response){
//   //console.log("test passed")
//   var $ = cheerio.load(response.data);
//   var results = [];
//   $("div.post-list__title").each(function(i, element) {
    
//     var update = $(element).find("a").text()
//     console.log(update)
//   })
//  })
 axios.get("http://www.nintendolife.com/pokemon/news").then(function(response) {
  var $ = cheerio.load(response.data)
  
  $("li.item-article").each(function(i, element) {
    var title = $(element).find("div.item-wrap").find("div.info").find("div.info-wrap").find("p.heading").find("a").find("span.title").text()
    var image = $(element).find("div.item-wrap").find("div.image").find("a").find("img").attr("src");
    var summary = $(element).find("div.item-wrap").find("div.info").find("div.info-wrap").find("p.text").text()
    var link = $(element).find("div.item-wrap").find("div.info").find("div.info-wrap").find("p.heading").find("a").attr("href")
    link = "https://nintendolife.com/" + link
    //console.log(image)
    let post = {
      title: title,
      image: image,
      summary: summary,
      link: link
    }
    db.Article
      .create(post)
      .then(dbArticle => {
        console.log("added article to db")
        
      })
      .catch(err => console.log(err))
  })
 })
})
// LOGIN ROUTE
app.post('/api/login', (req, res) => {
  auth
    .logUserIn(req.body.email, req.body.password)
    .then(dbUser => res.json(dbUser))
    .catch(err => res.status(400).json(err));
});

// SIGNUP ROUTE
app.post('/api/signup', (req, res) => {
  db.User.create(req.body)
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
});

// Any route with isAuthenticated is protected and you need a valid token
// to access
app.get('/api/user/:id', isAuthenticated, (req, res) => {
  db.User.findById(req.params.id).then(data => {
    if (data) {
      res.json(data);
    } else {
      res.status(404).send({ success: false, message: 'No user found' });
    }
  }).catch(err => res.status(400).send(err));
});

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get('/', isAuthenticated /* Using the express jwt MW here */, (req, res) => {
  res.send('You are authenticated'); //Sending some response when authenticated
});

// Error handling
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
    res.status(401).send(err);
  }
  else {
    next(err);
  }
});

var players = {};
predatorId = 0
lastPredatorId = 0
io.on('connection', function (socket) {
  socket.on('disconnect', function () {
    delete players[socket.id];
  })

  socket.on('new player', function () {
    console.log("contents of players, ", players);

    if (isEmpty(players)) {
      players[socket.id] = {
        x: 800 * Math.random(),
        y: 600 * Math.random(),
        predator: true,
        lastPredator: false
      };
      predatorId = socket.id;
      lastPredatorId = socket.id;
    } else {
      players[socket.id] = {
        x: 800 * Math.random(),
        y: 600 * Math.random(),
        predator: false,
        lastPredator: false
      };
    }
  });
  socket.on('movement', function (data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});

setInterval(function () {
  for (var prey in players) {
    if (prey == predatorId) continue //same id, not self is not prey
    // console.log(
    //   Math.sqrt(
    //     Math.pow(players[predatorId].x - players[prey].x, 2) +
    //     Math.pow(players[predatorId].y - players[prey].y, 2))
    // )
    if ((Math.sqrt(
      Math.pow(players[predatorId].x - players[prey].x, 2) +
      Math.pow(players[predatorId].y - players[prey].y, 2)) < 20)
      && !players[prey].lastPredator) {
      console.log("INTERSECTION!");
      players[lastPredatorId].lastPredator = false;
      players[predatorId].predator = false;
      players[predatorId].lastPredator = true;
      players[prey].predator = true;
      lastPredatorId = predatorId;
      predatorId = prey;
    }
  }

  io.sockets.emit('state', players);
}, 1000 / 60);

//////////////////////////////////////////////////////////////
// useful functions....
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}


// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

server.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
