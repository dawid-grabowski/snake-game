const button = document.querySelector('button')
const highScoreText = document.querySelector('.high-score')
const scoreText = document.querySelector('.score')
const snakeElements = []
let food
let gameOver = false
let highScore = 0
let currentScore = 0

const generateRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min)
}

const numberToDirection = num => {
	if (num === 0) return 'up'
	if (num === 1) return 'right'
	if (num === 2) return 'down'
	if (num === 3) return 'left'
}

let snakeDirection = numberToDirection(generateRandomNumber(0, 4))

const spawnBoard = () => {
	const board = document.querySelector('.board')
	board.className = 'board'
	for (let i = 1; i <= 20; i++) {
		for (let j = 1; j <= 20; j++) {
			const div = document.createElement('div')
			div.className = 'board__element'
			div.dataset.x = j
			div.dataset.y = i

			board.appendChild(div)
		}
	}
}

spawnBoard()

const isGameOver = (x, y) => {
	if (x < 1 || x > 20 || y < 1 || y > 20 || snakeElements.some(({ dataset }) => dataset.x == x && dataset.y == y)) {
		if (highScore < currentScore && localStorage['highScore'] < currentScore) {
			highScore = currentScore
			highScoreText.textContent = highScore
			localStorage.setItem('highScore', highScore)
		}
		button.style.display = 'block'
		return true
	} else {
		return false
	}
}

isGameOver()

const moveSnake = () => {
	let gameInterval = setInterval(() => {
		let nextY = snakeElements[0]['dataset']['y']
		let nextX = snakeElements[0]['dataset']['x']

		if (snakeDirection === 'up') nextY--
		if (snakeDirection === 'right') nextX++
		if (snakeDirection === 'down') nextY++
		if (snakeDirection === 'left') nextX--

		if (isGameOver(nextX, nextY)) clearInterval(gameInterval)
		else {
			let nextSnakeElement = document.querySelector(`[data-x="${nextX}"][data-y="${nextY}"]`)

			snakeElements.unshift(nextSnakeElement)
			nextSnakeElement.classList.add('snake')

			if (nextSnakeElement !== food) {
				snakeElements.pop().classList.remove('snake')
			} else {
				food.classList.remove('food')
				currentScore += 1
				scoreText.textContent = currentScore
				createFood()
			}
		}
	}, 200)
}

const controlSnake = () => {
	window.addEventListener('keydown', e => {
		e.preventDefault()

		if ((e.key === 'a' || e.key === 'ArrowLeft') && snakeDirection !== 'right') {
			snakeDirection = 'left'
		}
		if ((e.key === 's' || e.key === 'ArrowDown') && snakeDirection !== 'up') {
			snakeDirection = 'down'
		}
		if ((e.key === 'd' || e.key === 'ArrowRight') && snakeDirection !== 'left') {
			snakeDirection = 'right'
		}
		if ((e.key === 'w' || e.key === 'ArrowUp') && snakeDirection !== 'down') {
			snakeDirection = 'up'
		}
	})
}

const createFood = () => {
	let xPos
	let yPos
	do {
		xPos = generateRandomNumber(1, 20)
		yPos = generateRandomNumber(1, 20)
	} while (snakeElements.some(({ dataset }) => dataset.x == xPos && dataset.y == yPos))

	food = document.querySelector(`[data-x="${xPos}"][data-y="${yPos}"]`)

	food.classList.add('food')
}

const createSnake = () => {
	let x = generateRandomNumber(9, 11)
	let y = generateRandomNumber(9, 11)
	for (let i = 1; i <= 3; i++) {
		if (snakeDirection === 'up') y--
		if (snakeDirection === 'right') x++
		if (snakeDirection === 'down') y++
		if (snakeDirection === 'left') x--

		let snakeElement = document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
		snakeElement.classList.add('snake')
		snakeElements.unshift(snakeElement)
	}
}

const playAgain = () => {
	button.style.display = 'none'
	currentScore = 0
	scoreText.textContent = currentScore

	while (snakeElements.length > 0) {
		snakeElements.pop()
	}

	for (let i = 1; i <= 20; i++) {
		for (let j = 1; j <= 20; j++) {
			let divs = document.querySelectorAll('.board__element')
			divs.forEach(div => {
				div.classList.remove('food', 'snake')
			})
		}
	}

	moveSnake()
	createSnake()
	createFood()
}

button.addEventListener('click', playAgain)

window.addEventListener('load', () => {
	if (localStorage.getItem('highScore')) {
		highScoreText.textContent = localStorage['highScore']
	}
})

createSnake()
moveSnake()
controlSnake()
createFood()
