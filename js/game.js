let canvas;
let context;
let fps = 50; //frame per second
let tileMap;
let cardWidth = 50;
let cardHeight = 50;

//scene
let wall;
let door;
let ground;
let key;

//characters
let protagonist;
let enemy = [];
let imgLamp = [];

//draw scene
let scene = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 0, 2, 1, 0],
	[0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0],
	[0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0],
	[0, 2, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0],
	[0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 2, 2, 2, 0],
	[0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0],
	[0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0],
	[0, 2, 2, 2, 0, 0, 3, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const drawScene = () => {
	for (y = 0; y < 10; y++) {
		for (x = 0; x < 20; x++) {
			let tile = scene[y][x];
			context.drawImage(tileMap, tile * 32, 0, 32, 32, cardWidth * x, cardHeight * y, cardWidth, cardHeight);
		}
	}
};

let lamp = function (x, y) {
	this.x = x;
	this.y = y;

	this.delay = 10;
	this.count = 0;
	this.frame = 0;

	this.changeFrame = function () {
		if (this.frame < 3) {
			this.frame++;
		} else {
			this.frame = 0;
		}
	};

	this.paint = function () {
		if (this.count < this.delay) {
			this.count++;
		} else {
			this.count = 0;
			this.changeFrame();
		}

		context.drawImage(tileMap, this.frame * 0, 64, 32, 32, cardWidth * x, cardHeight * y, cardWidth, cardHeight);
	};
};

let evil = function (x, y) {
	this.x = x;
	this.y = y;
	this.direction = Math.floor(Math.random() * 4);
	this.delay = 50;
	this.frame = 0;

	this.paint = function () {
		context.drawImage(tileMap, 0, 32, 32, 32, this.x * cardWidth, this.y * cardHeight, cardWidth, cardHeight);
	};

	this.checkCollision = function (x, y) {
		let collides = false;
		if (scene[y][x] === 0) {
			collides = true;
		}
		return collides;
	};

	this.move = function () {
		protagonist.collisionEnemy(this.x, this.y);
		if (this.count < this.delay) {
			this.count++;
		} else {
			this.count = 0;
			if (this.direction === 0) {
				if (this.checkCollision(this.x, this.y - 1) === false) {
					this.y--;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
			if (this.direction === 1) {
				if (this.checkCollision(this.x, this.y + 1) === false) {
					this.y++;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
			if (this.direction === 2) {
				if (this.checkCollision(this.x - 1, this.y) === false) {
					this.x--;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
			if (this.direction === 3) {
				if (this.checkCollision(this.x + 1, this.y) === false) {
					this.x++;
				} else {
					this.direction = Math.floor(Math.random() * 4);
				}
			}
		}
	};
};

function player() {
	this.x = 1;
	this.y = 1;
	this.key = false;

	this.paint = function () {
		context.drawImage(tileMap, 32, 32, 32, 32, this.x * cardWidth, this.y * cardHeight, cardWidth, cardHeight);
	};

	this.collisionEnemy = function (x, y) {
		if (this.x === x && this.y === y) {
			this.dead();
		}
	};

	this.margins = function (x, y) {
		let collision = false;
		if (scene[y][x] === 0) {
			collision = true;
		}
		return collision;
	};

	this.up = function () {
		if (this.margins(this.x, this.y - 1) === false) {
			this.y--;
			this.logicObject();
		}
	};
	this.down = function () {
		if (this.margins(this.x, this.y + 1) === false) {
			this.y++;
			this.logicObject();
		}
	};
	this.left = function () {
		if (this.margins(this.x - 1, this.y) === false) {
			this.x--;
			this.logicObject();
		}
	};
	this.right = function () {
		if (this.margins(this.x + 1, this.y) === false) {
			this.x++;
			this.logicObject();
		}
	};

	this.win = function () {
		console.log("Haz ganado");
		this.x = 1;
		this.y = 1;
		this.key = false;
		scene[8][6] = 3;
	};

	this.dead = function () {
		console.log("Haz perdido");
		this.x = 1;
		this.y = 1;
		this.key = false;
		scene[8][6] = 3;
	};

	this.logicObject = function () {
		let object = scene[this.y][this.x];
		if (object === 3) {
			this.key = true;
			scene[this.y][this.x] = 2;
			console.log("Haz obtenido la llave!!");
		}
		if (object === 1) {
			if (this.key === true) {
				this.win();
			} else {
				console.log("Te falta la llave!!! No puedes pasar");
			}
		}
	};
}

const initialize = () => {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	tileMap = new Image();
	tileMap.src = "./img/tilemap.png";

	protagonist = new player();

	imgLamp.push(new lamp(0, 0));
	imgLamp.push(new lamp(0, 5));
	imgLamp.push(new lamp(19, 0));
	imgLamp.push(new lamp(19, 5));

	enemy.push(new evil(3, 3));
	enemy.push(new evil(2, 7));
	enemy.push(new evil(7, 7));

	document.addEventListener("keydown", function (keyboard) {
		if (keyboard.keyCode === 38) {
			protagonist.up();
		}
		if (keyboard.keyCode === 40) {
			protagonist.down();
		}
		if (keyboard.keyCode === 37) {
			protagonist.left();
		}
		if (keyboard.keyCode === 39) {
			protagonist.right();
		}
	});

	setInterval(function () {
		principal();
	}, 1000 / fps);
};

const deleteCanvas = () => {
	canvas.width = 1000;
	canvas.height = 500;
};

const principal = () => {
	deleteCanvas();
	drawScene();
	protagonist.paint();
	for (c = 0; c < enemy.length; c++) {
		enemy[c].move();
		enemy[c].paint();
	}
	for (i = 0; i < imgLamp.length; i++) {
		imgLamp[i].paint();
	}
};
