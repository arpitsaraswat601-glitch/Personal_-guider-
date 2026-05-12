// --- 1. DYNAMIC DATA RECOVERY ---
// Agar storage mein kuch nahi hai, toh 'user' null rahega
let state = JSON.parse(localStorage.getItem('PG_DATA')) || {
    username: null, 
    level: 1,
    xp: 0,
    ptsStudy: 0,
    ptsStrength: 0,
    missions: [false, false, false]
};

// --- 2. USER IDENTITY INITIALIZATION ---
function initializeUser() {
    // Agar naam nahi hai, toh prompt pucho
    if (!state.username) {
        let name = prompt("Enter Operator Name:");
        state.username = name ? name.toUpperCase() : "OPERATOR";
        saveData();
    }
    document.getElementById('display-name').innerText = state.username;
}

// Data Save Function
function saveData() {
    localStorage.setItem('PG_DATA', JSON.stringify(state));
}

// XP aur Level Logic (Same as before but cleaner)
function addXP(type) {
    const gain = 10;
    state.xp += gain;
    
    if (type === 'study') state.ptsStudy += gain;
    if (type === 'strength') state.ptsStrength += gain;

    // Level calculation
    let newLevel = Math.floor(state.xp / 100) + 1;
    if (newLevel > state.level) {
        state.level = newLevel;
        if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
        alert("RANK INCREASED: LEVEL " + state.level);
    }

    updateUI();
    saveData();
}

function updateUI() {
    document.getElementById('display-name').innerText = state.username;
    document.getElementById('lvl-val').innerText = state.level;
    document.getElementById('pts-study').innerText = state.ptsStudy;
    document.getElementById('pts-strength').innerText = state.ptsStrength;
    
    // Progress Bar Logic
    let progress = state.xp % 100;
    let bar = document.getElementById('xp-fill');
    if(bar) bar.style.width = progress + "%";
}

// --- 3. SYSTEM BOOT ---
window.onload = () => {
    initializeUser(); // Pehle naam check karega
    
    setTimeout(() => {
        const loader = document.getElementById('loader');
        const shell = document.getElementById('app-shell');
        if(loader) loader.classList.add('hidden');
        if(shell) shell.classList.remove('hidden');
    }, 1200);

    updateUI();
    
    setInterval(() => {
        const timerElement = document.getElementById('main-timer');
        if(timerElement) timerElement.innerText = new Date().toLocaleTimeString();
    }, 1000);
};

// Tabs aur Guidance functions as usual...
