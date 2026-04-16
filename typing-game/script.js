// DOM Elements
const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');

// Test texts (Short paragraphs for smooth transitions)
const testTexts = [
    "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.",
    "Technology has revolutionized the way we communicate and work in the modern digital era.",
    "Typing speed is an essential skill for anyone working with computers in today's workplace.",
    "JavaScript is a versatile programming language primarily used for web development and beyond.",
    "A journey of a thousand miles begins with a single step, so keep practicing every single day.",
    "Consistency is the key to mastering any new skill, including typing without looking at the keys."
];

// Game state
let currentText = '';
let timeLeft = 60;
let timerInterval = null;
let startTime = null;
let isTestActive = false;
let bestWPM = 0;

// Persistent session stats for multi-sentence
let totalTypedEntries = 0; // Total correct characters typed across all sentences in this session
let totalErrors = 0;

// Initialize
loadBestWPM();

// Make typing container focusable for the overlay effect
textDisplay.parentElement.classList.add('typing-overlay');
textDisplay.insertAdjacentHTML('afterend', '<div class="start-prompt"><i class="fas fa-hand-pointer"></i> Click here & start typing</div>');

// Click text to focus input
textDisplay.parentElement.addEventListener('click', () => {
    if(!isTestActive && !startBtn.disabled) return; // Only allow focus if started
    typingArea.focus();
});

// Load best WPM from sessionStorage
function loadBestWPM() {
    const saved = sessionStorage.getItem('typingTestBestWPM');
    bestWPM = saved !== null ? parseInt(saved) : 0;
    bestWPMDisplay.innerText = bestWPM;
}

// Save best WPM
function saveBestWPM(wpm) {
    if (wpm > bestWPM) {
        bestWPM = wpm;
        sessionStorage.setItem('typingTestBestWPM', bestWPM);
        bestWPMDisplay.innerText = bestWPM;
    }
}

function getRandomText() {
    let newText;
    do {
        newText = testTexts[Math.floor(Math.random() * testTexts.length)];
    } while (newText === currentText && testTexts.length > 1);
    return newText;
}

// Load next text 
function loadNextText() {
    // Accumulate stats from current string before wiping
    const typedText = typingArea.value;
    
    let correctInCurrent = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentText[i]) correctInCurrent++;
    }
    
    totalTypedEntries += correctInCurrent;
    
    // Load new text
    currentText = getRandomText();
    highlightText(''); // Initial blank render
    
    typingArea.value = '';  
    typingArea.focus();
}

// Start test
function startTest() {
    // Reset state
    timeLeft = 60;
    isTestActive = true;
    startTime = null;
    totalTypedEntries = 0;
    totalErrors = 0;
    
    wpmDisplay.innerText = '0';
    accuracyDisplay.innerText = '100%';
    timerDisplay.innerText = '60';
    timerDisplay.style.color = '#e2b714'; 
   
    currentText = getRandomText();
    highlightText(''); 
   
    typingArea.disabled = false;
    typingArea.value = '';
    typingArea.focus();
   
    startBtn.disabled = true;
   
    timerInterval = setInterval(updateTimer, 1000);
}

// Update timer
function updateTimer() {
    if (!startTime) return; // Don't tick down until they actually start typing
    
    timeLeft--;
    timerDisplay.innerText = timeLeft;
   
    if (timeLeft <= 0) {
        endTest();
    }
    // Warning color
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#ca4754';
    }
}

// Handle typing input
typingArea.addEventListener('input', function() {
    if (!isTestActive) return;
   
    // Start time on very first keystroke
    if (!startTime) {
        startTime = Date.now();
    }
   
    const typedText = typingArea.value;
    
    // Count if the last pressed key was an error
    if (typedText.length > 0) {
        const lastCharIndex = typedText.length - 1;
        if (typedText[lastCharIndex] !== currentText[lastCharIndex]) {
            totalErrors++;
        }
    }

    updateStats();
    highlightText(typedText);
    
    // Check if current sentence is fully correctly completed
    if (typedText === currentText) {
        loadNextText();
    }
});

// Update statistics
function updateStats() {
    const typedText = typingArea.value;
   
    // Calculate total correct in current buffer
    let correctInCurrent = 0;
    for (let i = 0; i < Math.min(typedText.length, currentText.length); i++) {
        if (typedText[i] === currentText[i]) {
            correctInCurrent++;
        }
    }
    
    const grossCorrectEntries = totalTypedEntries + correctInCurrent;
    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    
    // Standard WPM: (Total characters / 5) / time
    const wpm = elapsedMinutes > 0 ? Math.round((grossCorrectEntries / 5) / elapsedMinutes) : 0;
    wpmDisplay.innerText = wpm;
   
    // Accuracy
    const totalKeystrokes = grossCorrectEntries + totalErrors;
    const accuracy = totalKeystrokes > 0 
        ? ((grossCorrectEntries / totalKeystrokes) * 100).toFixed(1) 
        : 100;
        
    accuracyDisplay.innerText = `${accuracy}%`;
}

// Highlight typed text
function highlightText(typedText) {
    let highlightedHTML = '';
   
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                highlightedHTML += `<span class="correct">${currentText[i]}</span>`;
            } else {
                highlightedHTML += `<span class="incorrect">${currentText[i]}</span>`;
            }
        } else if (i === typedText.length) {
            highlightedHTML += `<span class="current">${currentText[i]}</span>`;
        } else {
            highlightedHTML += currentText[i];
        }
    }
   
    textDisplay.innerHTML = highlightedHTML;
}

// End test
function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    typingArea.disabled = true;
    startBtn.disabled = false;
   
    const finalWPM = parseInt(wpmDisplay.innerText);
    saveBestWPM(finalWPM);
   
    // Wait slightly so UI updates
    setTimeout(() => {
        alert(`Test Complete!\nSpeed: ${finalWPM} WPM\nAccuracy: ${accuracyDisplay.innerText}`);
    }, 100);
}

// Reset session
function resetSession() {
    // End current test if active
    if(isTestActive) {
        clearInterval(timerInterval);
        isTestActive = false;
        typingArea.disabled = true;
        startBtn.disabled = false;
        textDisplay.innerHTML = 'Click "Start Test" to begin typing!';
        timerDisplay.innerText = '60';
        wpmDisplay.innerText = '0';
        accuracyDisplay.innerText = '100%';
        timerDisplay.style.color = '#e2b714';
    }
    
    if (bestWPM > 0 && confirm('Reset session best score?')) {
        sessionStorage.removeItem('typingTestBestWPM');
        bestWPM = 0;
        bestWPMDisplay.innerText = 0;
    }
}

// Default state text
textDisplay.innerHTML = 'Click "Start Test" to begin typing!';

// Event listeners
startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetSession);
