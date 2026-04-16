// DOM elements 
const scoreDisplay = document.querySelector('#score');
const timeleftDisplay = document.querySelector('#timeLeft');
const maxscoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const resumeBtn = document.querySelector('#resumeBtn');
const holes = document.querySelectorAll('.hole');
console.log('Holes:', holes);
const moles = document.querySelectorAll('.mole');

// Debug: Log buttons
console.log('Pause Btn:', pauseBtn);
console.log('Resume Btn:', resumeBtn);
if (!pauseBtn || !resumeBtn) {
    console.error('Buttons not found! Check HTML IDs.');
}

// Required variables
let score = 0;
let time = 30;
let bestScore = 0;
let playgame = false;
let gameId = null;
let isPaused = false;

// Init function
function webLoad() {
    onLoad();
    displayContent();
    // Ensure buttons hidden initially
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (resumeBtn) resumeBtn.style.display = 'none';
}

// Load high score
function onLoad() {
    const temp = localStorage.getItem('highScoreGame');
    if (temp != null) {
        bestScore = parseInt(temp, 10);
    } else {
        bestScore = 0;
    }
}

// Update display
function displayContent() {
    scoreDisplay.textContent = score;
    timeleftDisplay.textContent = time;
    maxscoreDisplay.textContent = bestScore;
}

// Random time
function randomTimeGenerator(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random hole
function randomIndex() {
    const index = Math.floor(Math.random() * holes.length);
    return holes[index];
}

// Pop mole
function popImageGame() {
    if (!playgame || isPaused) return;
    const randomTime = randomTimeGenerator(500, 1500);
    const hole = randomIndex();
    const mole = hole.querySelector('.mole');
    mole.classList.add('up');
    setTimeout(() => {
        mole.classList.remove('up');
        if (playgame && !isPaused) popImageGame();
    }, randomTime);
}

// End game
function endGame() {
    clearInterval(gameId);
    playgame = false;
    isPaused = false;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('highScoreGame', bestScore);
        alert(`New high score: ${score}! 🎉`);
    } else {
        alert(`Game over! Your score: ${score}`);
    }
    score = 0;
    time = 30;
    displayContent();
    startBtn.disabled = false;
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (resumeBtn) resumeBtn.style.display = 'none';
}

// Pause game
function pauseGame() {
    if (!playgame || isPaused || !pauseBtn) return;
    console.log('Pausing game...');
    isPaused = true;
    clearInterval(gameId);
    playgame = false;
    if (pauseBtn) pauseBtn.style.display = 'none';
    if (resumeBtn) resumeBtn.style.display = 'inline-block';
    startBtn.disabled = true;
}

// Resume game
function resumeGame() {
    if (!isPaused || !resumeBtn) return;
    console.log('Resuming game...');
    isPaused = false;
    playgame = true;
    if (pauseBtn) pauseBtn.style.display = 'inline-block';
    if (resumeBtn) resumeBtn.style.display = 'none';
    // Restart timer
    gameId = setInterval(() => {
        time--;
        displayContent();
        if (time <= 0) endGame();
    }, 1000);
    // Resume popping
    popImageGame();
}

// Start game
function startGame() {
    score = 0;
    time = 30;
    playgame = true;
    isPaused = false;
    startBtn.disabled = true;
    displayContent();
    // Show pause, hide resume
    if (pauseBtn) {
        pauseBtn.style.display = 'inline-block';
        console.log('Pause button shown');
    }
    if (resumeBtn) resumeBtn.style.display = 'none';

    popImageGame();

    gameId = setInterval(() => {
        time--;
        displayContent();
        if (time <= 0) endGame();
    }, 1000);
}

// Bonk handler
function bonk(event) {
    if (!playgame || isPaused) return;
    const target = event.target;
    if (target.classList.contains('up')) {
        score++;
        target.classList.remove('up');
        target.classList.add('bonked');
        displayContent();
    }
    setTimeout(() => target.classList.remove('bonked'), 300);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    webLoad();
    startBtn.addEventListener('click', startGame);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseGame);
    if (resumeBtn) resumeBtn.addEventListener('click', resumeGame);

    moles.forEach((box) => box.addEventListener('click', bonk));
});

