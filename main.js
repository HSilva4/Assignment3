function distance(a, b) {
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1.0)) + min;
}

function subtractColor(circle) {
	switch (circle.color) {
		case 'rgb(255,0,0)':
			numRed--;
			break;
		case 'rgb(0,255,0)':
			numGreen--;
			break;
		case 'rgb(0,0,255)':
			numBlue--;
			break;
		case 'rgb(255,255,255)':
			numWhite--;
			break;
		case 'rgb(0,0,0)':
			numBlack--;
			break;
		default:
			numOther--;
			break;
	}
}
;

function addColor(circle) {
	switch (circle.color) {
		case 'rgb(255,0,0)':
			numRed++;
			break;
		case 'rgb(0,255,0)':
			numGreen++;
			break;
		case 'rgb(0,0,255)':
			numBlue++;
			break;
		case 'rgb(255,255,255)':
			numWhite++;
			break;
		case 'rgb(0,0,0)':
			numBlack++;
			break;
		default:
			numOther++;
			break;
	}
}
;

function Circle(game) {
	this.radius = circleRadius;
	if (RorGorB) {
		var num = getRandomNumber(0, 2);
		this.red = 0;
		this.green = 0;
		this.blue = 0;
		if (num === 0) {
			this.red = 255;
			numRed++;
		}
		if (num === 1) {
			this.green = 255;
			numGreen++;
		}
		if (num === 2) {
			this.blue = 255;
			numBlue++;
		}
	} else if (randomRGB) {
		this.red = getRandomNumber(0, 255);
		this.green = getRandomNumber(0, 255);
		this.blue = getRandomNumber(0, 255);
	}
	this.color = 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
	Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (600 - this.radius * 2));
	this.velocity = {x: Math.random() * 1000, y: Math.random() * 1000};
	var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
	if (speed > maxSpeed) {
		var ratio = maxSpeed / speed;
		this.velocity.x *= ratio;
		this.velocity.y *= ratio;
	}
};



Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;


Circle.prototype.collide = function (other) {
	return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
	return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
	return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
	return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
	return (this.y + this.radius) > 600;
};

Circle.prototype.update = function () {
	this.x += this.velocity.x * this.game.clockTick;
	this.y += this.velocity.y * this.game.clockTick;

	if (this.collideLeft() || this.collideRight()) {
		this.velocity.x = -this.velocity.x * friction;
		if (this.collideLeft())
			this.x = this.radius;
		if (this.collideRight())
			this.x = 800 - this.radius;
		this.x += this.velocity.x * this.game.clockTick;
		this.y += this.velocity.y * this.game.clockTick;
	}

	if (this.collideTop() || this.collideBottom()) {
		this.velocity.y = -this.velocity.y * friction;
		if (this.collideTop())
			this.y = this.radius;
		if (this.collideBottom())
			this.y = 600 - this.radius;
		this.x += this.velocity.x * this.game.clockTick;
		this.y += this.velocity.y * this.game.clockTick;
	}

	for (var i = 0; i < this.game.entities.length; i++) {
		var ent = this.game.entities[i];
		if (ent !== this && this.collide(ent)) {
			var temp = {x: this.velocity.x, y: this.velocity.y};

			var dist = distance(this, ent);
			var delta = this.radius + ent.radius - dist;
			var difX = (this.x - ent.x) / dist;
			var difY = (this.y - ent.y) / dist;

			this.x += difX * delta / 2;
			this.y += difY * delta / 2;
			ent.x -= difX * delta / 2;
			ent.y -= difY * delta / 2;

			this.velocity.x = ent.velocity.x * friction;
			this.velocity.y = ent.velocity.y * friction;
			ent.velocity.x = temp.x * friction;
			ent.velocity.y = temp.y * friction;
			this.x += this.velocity.x * this.game.clockTick;
			this.y += this.velocity.y * this.game.clockTick;
			ent.x += ent.velocity.x * this.game.clockTick;
			ent.y += ent.velocity.y * this.game.clockTick;

			if (swapColors) {
				if (RorGorB) {
					subtractColor(this);
					subtractColor(ent);
				}

				var colorToSwap = getRandomNumber(0, 2);
				if (colorToSwap === 0) {
					var thisColor = this.red;
					var entColor = ent.red;
					this.red = entColor;
					ent.red = thisColor;
				} else if (colorToSwap === 1) {
					var thisColor = this.green;
					var entColor = ent.green;
					this.green = entColor;
					ent.green = thisColor;
				} else {
					var thisColor = this.blue;
					var entColor = ent.blue;
					this.blue = entColor;
					ent.blue = thisColor;
				}
				this.color = 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
				ent.color = 'rgb(' + ent.red + ',' + ent.green + ',' + ent.blue + ')';
				if (RorGorB) {
					addColor(this);
					addColor(ent);
					document.getElementById("numRed").innerHTML = numRed;
					document.getElementById("numGreen").innerHTML = numGreen;
					document.getElementById("numBlue").innerHTML = numBlue;
					document.getElementById("numWhite").innerHTML = numWhite;
					document.getElementById("numBlack").innerHTML = numBlack;
					document.getElementById("numOther").innerHTML = numOther;
				}
			}

			var whoGetsBig = getRandomNumber(0, 1);
			if (whoGetsBig === 0) {
				this.radius = this.radius * rateOfGrowth;
				ent.radius = ent.radius / rateOfGrowth;
			} else {
				ent.radius = ent.radius * rateOfGrowth;
				this.radius = this.radius / rateOfGrowth;
			}

			this.color = 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
			ent.color = 'rgb(' + ent.red + ',' + ent.green + ',' + ent.blue + ')';
		}


	}


	this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
	this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
	Entity.prototype.update.call(this);
};

Circle.prototype.draw = function (ctx) {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.strokeStyle = 'rgb(255,0,0)';
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	if (this.color === 'rgb(0,0,0)')
		ctx.stroke();
	ctx.fill();
	ctx.closePath();
};


document.getElementById('startButton').onclick = function () {
	maxSpeed = parseFloat(document.getElementById('maxSpeed').value);
	circleRadius = parseFloat(document.getElementById('circleRadius').value);
	friction = parseFloat(document.getElementById('friction').value);
	numCircles = parseFloat(document.getElementById('numCircles').value);
	rateOfGrowth = parseFloat(document.getElementById('rateOfGrowth').value);
	if (document.getElementById("swapColors").checked)
		swapColors = 1;
	else
		swapColors = 0;
	if (document.getElementById("randomRGB").checked) {
		randomRGB = 1;
		RorGorB = 0;
		document.getElementById("colorStats").hidden = true;
	} else {
		randomRGB = 0;
		RorGorB = 1;
		document.getElementById("colorStats").hidden = false;
	}
	numRed = 0;
	numGreen = 0;
	numBlue = 0;
	numWhite = 0;
	numBlack = 0;
	numOther = 0;
	for (var i = 0; i < gameEngine.entities.length; i++) {
		gameEngine.entities[i].removeFromWorld = true;
	}

	for (var i = 0; i < numCircles; i++) {
		var circle = new Circle(gameEngine);
		gameEngine.addEntity(circle);
	}

	document.getElementById("numRed").innerHTML = numRed;
	document.getElementById("numGreen").innerHTML = numGreen;
	document.getElementById("numBlue").innerHTML = numBlue;
	document.getElementById("numWhite").innerHTML = numWhite;
	document.getElementById("numBlack").innerHTML = numBlack;
	document.getElementById("numOther").innerHTML = numOther;

};

document.getElementById('resetButton').onclick = function () {
	document.getElementById("currentValue0").innerHTML = 200;
	document.getElementById("currentValue1").innerHTML = 20;
	document.getElementById("currentValue2").innerHTML = 1;
	document.getElementById("currentValue3").innerHTML = 15;
	document.getElementById("currentValue4").innerHTML = 1;
	document.getElementById("colorStats").hidden = true;
	friction = 1;
	maxSpeed = 200;
	circleRadius = 20;
	numCircles = 15;
	rateOfGrowth = 1;
	swapColors = 1;
	randomRGB = 1;
	RorGorB = 0;
	numRed = 0;
	numGreen = 0;
	numBlue = 0;
	numWhite = 0;
	numBlack = 0;
	numOther = 0;
	for (var i = 0; i < gameEngine.entities.length; i++) {
		gameEngine.entities[i].removeFromWorld = true;
	}
	for (var i = 0; i < numCircles; i++) {
		var circle = new Circle(gameEngine);
		gameEngine.addEntity(circle);
	}
};

document.getElementById("save").onclick = function () {
	var newEntities = [];
	for (var i = 0; i < gameEngine.entities.length; i++) {
		newEntities[i] = {
			red: gameEngine.entities[i].red,
			green: gameEngine.entities[i].green,
			blue: gameEngine.entities[i].blue,
			color: gameEngine.entities[i].color,
			radius: gameEngine.entities[i].radius,
			velocity: gameEngine.entities[i].velocity,
			x: gameEngine.entities[i].x,
			y: gameEngine.entities[i].y
		};
	}


	var states = {friction: friction, maxSpeed: maxSpeed, circleRadius: circleRadius, numCircles: numCircles,
		rateOfGrowth: rateOfGrowth, swapColors: swapColors, randomRGB: randomRGB, RorGorB: RorGorB,
		numRed: numRed, numGreen: numGreen, numBlue: numBlue, numWhite: numWhite, numBlack: numBlack,
		numOther: numOther, entities: newEntities};

	socket.emit("save", {studentname: "Hannah Silva", statename: document.getElementById("saveName").value, data: states});

};

document.getElementById("load").onclick = function () {
	socket.emit("load", {studentname: "Hannah Silva", statename: document.getElementById("saveName").value});
	gameEngine.entities = [];

};

// the "main" code begins here
var socket = io.connect("http://76.28.150.193:8888");

socket.on("connect", function () {
	console.log("Connected!");
});

socket.on("load", function (data) {
	var states = data.data;
	friction = states.friction;
	maxSpeed = states.maxSpeed;
	circleRadius = states.circleRadius;
	numCircles = states.numCircles;
	rateOfGrowth = states.rateOfGrowth;
	swapColors = states.swapColors;
	randomRGB = states.randomRGB;
	RorGorB = states.RorGorB;

	var entitiesLength = states.entities.length;
	for (var i = 0; i < entitiesLength; i++) {
		var entity = states.entities[i];
		var circle = new Circle(gameEngine);
		circle.red = entity.red;
		circle.green = entity.green;
		circle.blue = entity.blue;
		circle.color = entity.color;
		circle.radius = entity.radius;
		circle.velocity = entity.velocity;
		circle.x = entity.x;
		circle.y = entity.y;
		gameEngine.addEntity(circle);
	}	
	numRed = states.numRed;
	numGreen = states.numGreen;
	numBlue = states.numBlue;
	numWhite = states.numWhite;
	numBlack = states.numBlack;
	numOther = states.numOther;
	document.getElementById("numRed").innerHTML = numRed;
	document.getElementById("numGreen").innerHTML = numGreen;
	document.getElementById("numBlue").innerHTML = numBlue;
	document.getElementById("numWhite").innerHTML = numWhite;
	document.getElementById("numBlack").innerHTML = numBlack;
	document.getElementById("numOther").innerHTML = numOther;
	document.getElementById("currentValue0").innerHTML = maxSpeed;
	document.getElementById("maxSpeed").value = maxSpeed;
	document.getElementById("currentValue1").innerHTML = circleRadius;
	document.getElementById("circleRadius").value = circleRadius;
	document.getElementById("currentValue2").innerHTML = friction;
	document.getElementById("friction").value = friction;
	document.getElementById("currentValue3").innerHTML = numCircles;
	document.getElementById("numCircles").value = numCircles;
	document.getElementById("currentValue4").innerHTML = rateOfGrowth;
	document.getElementById("rateOfGrowth").value = rateOfGrowth;
	if (swapColors)
		document.getElementById("swapColors").checked = true;
	else
		document.getElementById("swapColors").checked = false;
	if (randomRGB) {
		document.getElementById("randomRGB").checked = true;
		document.getElementById("RorGorB").checked = false;
		document.getElementById("colorStats").hidden = true;
	} else if (RorGorB) {
		document.getElementById("randomRGB").checked = false;
		document.getElementById("RorGorB").checked = true;

		document.getElementById("colorStats").hidden = false;
	}

});

var friction = 1;
var maxSpeed = 200;
var circleRadius = 20;
var numCircles = 15;
var rateOfGrowth = 1;
var swapColors = 1;
var randomRGB = 1;
var RorGorB = 0;
var numRed = 0;
var numGreen = 0;
var numBlue = 0;
var numWhite = 0;
var numBlack = 0;
var numOther = 0;
var gameEngine;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
	console.log("starting up da sheild");
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameEngine = new GameEngine();
	for (var i = 0; i < numCircles; i++) {
		var circle = new Circle(gameEngine);
		gameEngine.addEntity(circle);
	}
	gameEngine.init(ctx);
	gameEngine.start();
});
