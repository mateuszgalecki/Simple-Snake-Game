import style from "./main.css";

window.addEventListener('DOMContentLoaded', (event) => {


// Creating a board
const board = document.getElementById('board');
let counter = 1;
let columnCounter = 1;
let rowCounter = 1;

for (let i = 0; i < 20; i++) {
	for (let j = 0; j < 20; j++) {
		const cell = document.createElement('div');
		cell.classList.add('cell' + counter);
		cell.dataset.row = rowCounter;
		cell.dataset.column = columnCounter;
		cell.classList.add('cell');
		// cell.innerHTML = counter;
		board.appendChild(cell);
		counter++;
		columnCounter++;
	}
	rowCounter++;
	columnCounter = 1;
}


let interval;
const menuBoard = document.getElementById('menu');
const gameBoard = document.getElementById('board');
const gameOverBoard = document.getElementById('game-over');
const difficulties = document.querySelectorAll('p.difficulty-option');


const Game = {
	snakeDirection: 'left',
	snakeLenght: 5,
	snakePosition: 316,
	previousSnakePosition: 317,
	snakeTail: [],
	score: 0,
	hasCrashed: false,
	shouldIMakeACoin: true,
	coinPos: 0,
	goingThroughWalls: false,
	difficulty: 'easy',
	
	
	
	moveTheSnake() {
		this.checkIfCrashed();
			
			// removing the snake head class regardless of the snakes direction:
			document.querySelector(`.cell${this.snakePosition}`).classList.forEach((className) => {
				if (className.indexOf('head') !== -1) {
					document.querySelector(`.cell${this.snakePosition}`).classList.remove(className);
				}
			});
			
			// moving snakes head (snakePosition)
			switch(this.snakeDirection) {
				case('right'):
					this.previousSnakePosition = this.snakePosition;
					this.snakeTail.unshift(this.previousSnakePosition);
					if (this.goingThroughWalls && this.snakePosition % 20 === 0) {
						let wentThroughWallPosition = this.snakePosition - 19;
						this.snakePosition = wentThroughWallPosition;
						this.checkIfCrashed();
						break;
					}
					this.snakePosition++;
					this.checkIfCrashed();
					break;
				case('left'):
					this.previousSnakePosition = this.snakePosition;
					this.snakeTail.unshift(this.previousSnakePosition);
					if (this.goingThroughWalls && this.snakePosition % 20 === 1) {
						let wentThroughWallPosition = this.snakePosition + 19;
						this.snakePosition = wentThroughWallPosition;
						this.checkIfCrashed();
						break;
					}
					this.snakePosition--;
					this.checkIfCrashed();
					break;
				case('up'):
					console.log('fiucisko')
					this.previousSnakePosition = this.snakePosition;
					this.snakeTail.unshift(this.previousSnakePosition);
					console.log(this.snakePosition);
					if (this.goingThroughWalls && this.snakePosition < 20) {
						let wentThroughWallPosition = this.snakePosition + 380;
						this.snakePosition = wentThroughWallPosition;
						console.log(wentThroughWallPosition);
						this.checkIfCrashed();
						break;
					}
					if (this.snakePosition === 20) {
						this.stopGame();
					} else {
						this.snakePosition = this.snakePosition - 20;
					this.checkIfCrashed();
					}
					break;
				case('down'):
					this.previousSnakePosition = this.snakePosition;
					this.snakeTail.unshift(this.previousSnakePosition);
					if (this.goingThroughWalls && this.snakePosition > 380) {
						let wentThroughWallPosition = this.snakePosition - 380;
						this.snakePosition = wentThroughWallPosition;
						this.checkIfCrashed();
						break;
					}
					this.snakePosition = this.snakePosition + 20;
					this.checkIfCrashed();
					break;
				default: console.log('sth went wrong');
			}
			
			
			// creating a new snake tail
			if (this.snakeTail.length + 1 > this.snakeLenght) {
				let oldSnakeTail = this.snakeTail;
				let oldCell = oldSnakeTail.pop();
				this.snakeTail = oldSnakeTail;
				console.log('works');
				document.querySelector(`.cell${oldCell}`).classList.remove('snake-cell');
			}
			this.snakeTail.forEach((tailCell) => {
				document.querySelector(`.cell${tailCell}`).classList.add('snake-cell');
			});
			
			
			// adding different head styles with regard to the snake direction:
			// document.querySelector(`.cell${this.snakePosition}`).classList.add('snake-head');
			
			switch (this.snakeDirection) {
				case('left'):
				document.querySelector(`.cell${this.snakePosition}`).classList.add('snake-head-left');
				break;
				case('right'):
				document.querySelector(`.cell${this.snakePosition}`).classList.add('snake-head-right');
				break;
				case('up'):
				document.querySelector(`.cell${this.snakePosition}`).classList.add('snake-head-up');
				break;
				case('down'):
				document.querySelector(`.cell${this.snakePosition}`).classList.add('snake-head-down');
				break;
			}
			
			
			if (this.shouldIMakeACoin) {
				let coinPosition;
				for (let i = 1; i < 20; i++) {
					coinPosition = Math.floor((Math.random() * 400) + 1);
					let isCoinPositionGood = true;
					this.snakeTail.forEach((tailPart) => {
						if (coinPosition === tailPart) {
							isCoinPositionGood = false;
						}
					})
					console.log('!!!!!!!!!!');
					if (isCoinPositionGood) {break};
				}
				this.coinPos = coinPosition;
				document.querySelector(`.cell${coinPosition}`).classList.add('coin');
				this.shouldIMakeACoin = false;
			}
			this.checkIfScored();
	},
	snakeMoves() {
		let snakeSpeed;
		switch(this.difficulty) {
			case('easy'):
			snakeSpeed = 300;
			break;
			case('medium'):
			snakeSpeed = 120;
			break;
			case('strong'):
			snakeSpeed = 30;
			break;
		}
		interval = setInterval(() => {
			if (this.hasCrashed) {
				clearInterval(interval);
			}
			console.log('snake moves');
			console.log(snakeSpeed);
			this.moveTheSnake();
		}, snakeSpeed);
	},
	moveTheSnakeByForce() {
		this.moveTheSnake();
		clearInterval(interval);
		this.snakeMoves();
	},
	checkIfCrashed() {
		console.log(this.snakePosition);
		// checking if crashed with wall
		if (!this.goingThroughWalls) {
			if (this.snakePosition < 0 || this.snakePosition > 400) {
			this.stopGame();
		};
		let previousColumn = Number(document.querySelector(`.cell${this.previousSnakePosition}`).dataset.column);
		let currentColumn = Number(document.querySelector(`.cell${this.snakePosition}`).dataset.column);
		if (Math.abs(previousColumn - currentColumn) > 1) {
			this.stopGame();
		}};
		// checking if crashed with self
		this.snakeTail.forEach((tailPart) => {
			if (tailPart === this.snakePosition) {
				this.stopGame();
			}
		});
	},
	checkIfScored() {
		if (this.snakePosition === this.coinPos) {
			let previousScore = this.score;
			previousScore++;
			this.score = previousScore;
			let previousLength = this.snakeLenght;
			previousLength++;
			this.snakeLenght = previousLength;
			console.log(previousScore);
			document.querySelector(`.cell${this.coinPos}`).classList.remove('coin');
			this.shouldIMakeACoin = true;
		}
	},
	stopGame() {
		console.log('crashed!');
		const scoreBox = document.getElementById('score-box');
		scoreBox.children[0].innerText = 'Your score is: ' + this.score;
		gameOverBoard.style.display = 'flex';
		// board.style.display = 'none';
		gameBoard.classList.remove('show');
		this.hasCrashed = true;
		console.log(this.hasCrashed);
		
		// this.snakeTail.forEach((tailPart) => {
			// let tailCell = document.querySelector(`.cell${tailPart}`);
			// tailCell.classList.remove('snake-cell');
			// console.log(tailCell);
		// });
		// let coinCell = document.querySelector(`.cell${this.coinPos}`);
		// coinCell.classList.remove('coin');
	}
}


// handling the difficulty options


difficulties.forEach((difficulty) => {
	console.log(difficulty);
	difficulty.onclick = (event) => {
		console.log(event);
		difficulties.forEach((dif) => {
			dif.classList.remove('checked');
		});
		event.target.classList.add('checked');
		let difficulty = event.target.dataset.difficulty;
		console.log(difficulty);
		Game.difficulty = difficulty;
		console.log(Game.difficulty);
	}
	
});

// handling the start button

const startBtn = document.getElementById('startBtn');
startBtn.onclick = (event) => {
	menuBoard.classList.add('hide');
	gameBoard.classList.add('show');
	Game.snakeMoves();
	difficulties.forEach((difficulty) => {
		difficulty.classList.remove('checked');
	})
}

// handling the going through walls option

const goingThroughWallsInput = document.getElementById('going-through');
goingThroughWallsInput.onclick = (event) => {
	if (event.target.checked) {
		Game.goingThroughWalls = true;
		event.target.classList.add('checkbox-checked')
	} else {
		Game.goingThroughWalls = false;
		event.target.classList.remove('checkbox-checked')
	};
};

// handling the back button

const backBtn = document.getElementById('backBtn');
backBtn.onclick = (event) =>{
	Game.snakeTail.forEach((tailPart) => {
			let tailCell = document.querySelector(`.cell${tailPart}`);
			tailCell.classList.remove('snake-cell');
			console.log(tailCell);
		});
	let coinCell = document.querySelector(`.cell${Game.coinPos}`);
	coinCell.classList.remove('coin');
	let headCell = document.querySelector(`.cell${Game.snakePosition}`);
	if (headCell === null) {
		console.log('anything');
	} else {
		headCell.classList.forEach((cls) => {
		if (cls.includes('snake')) {
			headCell.classList.remove(cls);
		}
	})};
	
	goingThroughWallsInput.checked = false;
	goingThroughWallsInput.classList.remove('checkbox-checked');
	Game.snakeDirection = 'left';
	Game.snakeLenght = 5;
	Game.snakePosition = 316;
	Game.previousSnakePosition = 317;
	Game.snakeTail = [];
	Game.score = 0;
	Game.hasCrashed = false;
	Game.shouldIMakeACoin = true;
	Game.coinPos = 0;
	Game.goingThroughWalls = false;
	Game.difficulty = 'easy';
	gameOverBoard.style.display = 'none';
	menuBoard.classList.remove('hide');
}


const keydown = (event) => {
	switch(event.keyCode) {
		case(38):
		if (Game.snakeDirection === 'down') {break;};
		Game.snakeDirection = 'up';
		Game.moveTheSnakeByForce();
		break;
		case(40):
		if (Game.snakeDirection === 'up') {break;};
		Game.snakeDirection = 'down';
		Game.moveTheSnakeByForce();
		break;
		case(37):
		if (Game.snakeDirection === 'right') {break;};
		Game.snakeDirection = 'left';
		Game.moveTheSnakeByForce();
		break;
		case(39):
		if (Game.snakeDirection === 'left') {break;};
		Game.snakeDirection = 'right';
		Game.moveTheSnakeByForce();
		break;
	};
}
document.addEventListener('keydown', keydown)

// Game.snakeMoves();

});


// trzeba robić od nowa i potraktować węża jako tabelę z numerami komórek

