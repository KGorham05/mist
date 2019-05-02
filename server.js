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
//get news articles from the database route
app.get("/api/articles", (req, res) => {
  db.Article
    .find({}).limit(12)
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err))
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

//Game Logic
var projectiles = {};
var pid = 0;			//projectile ID
var players = {};		//keys are socketId, values for player are data objects
predatorId = 0
lastPredatorId = 0

io.on('connection', function(socket) {
	// CHAT LOGIC
  
  socket.on('new message', (data) => {
    console.log(`Server received new message`)
    // we tell the client to execute 'new message'
    console.log(data)
    io.emit('new message', {
      message: data.message,
      username: data.username
    });
  });
//////////////////////////////////////

	console.log(socket.id);
	socket.on('disconnect', function(){
		safeRemove(socket.id)
	})


	socket.on('new player', function() {
		if(isEmpty(players)){
			predatorId = socket.id;
			lastPredatorId = socket.id;
			players[socket.id] = new Play(true); //set predator to this player
		}else{
			players[socket.id] = new Play(false);//set predator false 
		}
	});

	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		player.facing = data.facing;
		player.frameX = ++player.frameX % 4;
		if (data.fire && player.canFire){
			player.canFire = false;		
			var proj = new Proj(socket.id)
			if (data.up) {
				player.y -= 5;
				proj.Dy  -= 10
			}
			if (data.down) {
				player.y += 5;
				proj.Dy  += 10;
			}
			if (data.left) {
				player.x -= 5;
				proj.Dx  -= 10;
			}
			if (data.right) {
				player.x += 5;
				proj.Dx  += 10;
			}
			if(!(proj.Dy || proj.Dx)){
				proj.distRem *= 10;
			}
			//the frames are 64x64, x,y of frame ref is top-left
			//it isn't center so adjust 32x32
			//this is also reflected in checking for hits 
			proj.x = player.x + 32;
			proj.y = player.y + 32;
			projectiles[pid++] = proj;
			//
			setTimeout( (() => player.canFire = true), 1000); 
		}else{
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
		}
	
	});
});
setInterval(function() {
	for(var preyId in players){
		if(preyId == predatorId) continue //if same id, skip
		/*console.log(					  //log distance for dev
			Math.sqrt(
				Math.pow(players[predatorId].x - players[preyId].x,2) +
				Math.pow(players[predatorId].y - players[preyId].y,2))
			)	 */
		//ask if collision, ie distance < 2*radius
		if((Math.sqrt(
			Math.pow(players[predatorId].x - players[preyId].x,2) +
			Math.pow(players[predatorId].y - players[preyId].y,2)) < 20)
			&& !players[preyId].lastPredator)
		{
			players[lastPredatorId].lastPredator = false;
			players[predatorId].predator = false;
			players[predatorId].lastPredator = true;
			players[preyId].predator = true;
			if(players[preyId].hp <= 30){
				safeRemove(preyId);
			}else{
				players[preyId].hp -= 30;
				lastPredatorId = predatorId;
				predatorId = preyId;
			} 
		}
	}
		
	for(var p in projectiles){
		if(projectiles[p].distRem < 10){
			delete projectiles[p];
			break ;
		}
		projectiles[p].distRem -= 10;
		projectiles[p].x += projectiles[p].Dx;
		projectiles[p].y += projectiles[p].Dy; 	
		for(var id in players){
			if(
				(id != projectiles[p].from) &&
				//adjusted 32x32 for center
				(Math.sqrt(
					Math.pow(players[id].x - projectiles[p].x +32,2) +
					Math.pow(players[id].y - projectiles[p].y +32,2)) < 14)
			){
				if(players[id].hp <= 10){
					safeRemove(id);
				}else{
					players[id].hp -=10;
				}
				delete projectiles[p];
				break 
			}
		}
	}
	
	io.sockets.emit('state', {players, projectiles});

}, 1000 / 60);

//////////////////////////////////////////////////////////////
// useful functions....
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function drawPlayerId(){
	for(var randPlayerId in players){
		return randPlayerId;
	} 
}

function Proj(socketId){
	this.from = socketId;
	this.x = 0;
	this.y = 0;
	this.Dx = 0;
	this.Dy = 0;
	this.distRem = 500; 
}
function Play(isPred){
	this.predator = isPred;
	this.lastPredator = false;
	this.frameX = 0;
	this.facing = "down";
	this.x = 736 * Math.random();
	this.y = 536 * Math.random();
	this.fire = false;
	this.hp = 100;
	this.canFire = true;
}



function safeRemove(socketId){
	delete players[socketId];     	
	if(socketId == lastPredatorId){
		lastPredatorId = drawPlayerId() || 0;
		if(lastPredatorId)
			players[lastPredatorId].lastPredator = true;
	}
	if(socketId == predatorId){
		predatorId = drawPlayerId() || 0;
		if(predatorId)
			players[predatorId].predator = true;
	}
}
  

///////////////////////////


// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

server.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
