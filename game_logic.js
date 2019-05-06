const projectiles = {};
let pid = 0;			//projectile ID
const players = {};		//keys are socketId values for player are data objects
let predatorId = 0;
let lastPredatorId = 0

const gameLogic = function (io) {
    io.on('connection', function (socket) {
        socket.on('disconnect', function () {
            safeRemove(socket.id)
        })


        socket.on('new player', function (username) {
            console.log(players);
            if (isEmpty(players)) {
                predatorId = socket.id;
                lastPredatorId = socket.id;
                players[socket.id] = new Play(true, username); //set predator to this player
            } else {
                players[socket.id] = new Play(false, username);//set predator false 
            }
            console.log(players);
        });

        socket.on('movement', function (data) {
            var player = players[socket.id] || {};
            player.facing = data.facing;
            player.frameX = ++player.frameX % 4;
			//
			if(player.x < -32) 
				player.x = 736;

			else if (player.x > 736) 
				player.x = -32;

			if(player.y < -32)
				player.y = 536;

			else if(player.y > 536)
				player.y = -32;
			//
            if (data.fire && player.canFire) {
                player.canFire = false;
                var proj = new Proj(socket.id)
                if (data.up) {
                    player.y -= 5;
                    proj.Dy -= 10
                }
                if (data.down) {
                    player.y += 5;
                    proj.Dy += 10;
                }
                if (data.left) {
                    player.x -= 5;
                    proj.Dx -= 10;
                }
                if (data.right) {
                    player.x += 5;
                    proj.Dx += 10;
                }
                if (!(proj.Dy || proj.Dx)) {
                    proj.distRem *= 10;
                }
                //the frames are 64x64, x,y of frame ref is top-left
                //it isn't center so adjust 32x32
                //this is also reflected in checking for hits 
                proj.x = player.x + 32;
                proj.y = player.y + 32;
                projectiles[pid++] = proj;
                //
                setTimeout((() => player.canFire = true), 1000);
            } else {
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
    
    setInterval(function () {
        for (var preyId in players) {
            if (preyId == predatorId) continue //if same id, skip
            /*console.log(					  //log distance for dev
                Math.sqrt(
                    Math.pow(players[predatorId].x - players[preyId].x,2) +
                    Math.pow(players[predatorId].y - players[preyId].y,2))
                )	 */
            //ask if collision, ie distance < 2*radius
            if ((Math.sqrt(
                Math.pow(players[predatorId].x - players[preyId].x, 2) +
                Math.pow(players[predatorId].y - players[preyId].y, 2)) < 20)
                && !players[preyId].lastPredator) {
                players[lastPredatorId].lastPredator = false;
                players[predatorId].predator = false;
                players[predatorId].lastPredator = true;
                players[preyId].predator = true;
                if (players[preyId].hp <= 30) {
                    dieMessage(preyId);
                    safeRemove(preyId);
                } else {
                    players[preyId].hp -= 30;
                    lastPredatorId = predatorId;
                    predatorId = preyId;
                }
            }
        }

        for (var p in projectiles) {
            if (projectiles[p].distRem < 10) {
                delete projectiles[p];
                break;
            }
            projectiles[p].distRem -= 10;
            projectiles[p].x += projectiles[p].Dx;
            projectiles[p].y += projectiles[p].Dy;
            for (var id in players) {
                if (
                    (id != projectiles[p].from) &&
                    //adjusted 32x32 for center
                    (Math.sqrt(
                        Math.pow(players[id].x - projectiles[p].x + 32, 2) +
                        Math.pow(players[id].y - projectiles[p].y + 32, 2)) < 14)
                ) {
                    if (players[id].hp <= 10) {
                        dieMessage(id);
                        safeRemove(id);
                    } else {
                        players[id].hp -= 10;
                    }
                    delete projectiles[p];
                    break
                }
            }
        }

        io.sockets.emit('state', { players, projectiles });

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

    function drawPlayerId() {
        for (var randPlayerId in players) {
            return randPlayerId;
        }
    }

    function Proj(socketId) {
        this.from = socketId;
        this.x = 0;
        this.y = 0;
        this.Dx = 0;
        this.Dy = 0;
        this.distRem = 500;
    }
    function Play(isPred, username) {
        this.username = username;
        console.log(this.username);
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

    function dieMessage(socketId) {
        io.emit('new message', {
            message: `${players[socketId].username} has been knocked-out!`,
            username: "GAME UPDATE"
        })
    }

    function safeRemove(socketId) {
        delete players[socketId];
        if (socketId == lastPredatorId) {
            lastPredatorId = drawPlayerId() || 0;
            if (lastPredatorId)
                players[lastPredatorId].lastPredator = true;
        }
        if (socketId == predatorId) {
            predatorId = drawPlayerId() || 0;
            if (predatorId)
                players[predatorId].predator = true;
        }
    }
}

module.exports = gameLogic;
