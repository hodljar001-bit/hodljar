// Game data and translations
const gameData = {
  translations: {
    en: {
      title: "TreasureSweeper",
      subtitle: "Find the treasure, avoid the traps!",
      difficulty: "Difficulty",
      explorer: "Explorer",
      adventurer: "Adventurer", 
      legend: "Legend",
      startGame: "Start Game",
      newGame: "New Game",
      dailyQuest: "Daily Quest",
      powerUps: "Power-Ups",
      lantern: "Lantern",
      ancientMap: "Ancient Map",
      explorersRope: "Explorer's Rope",
      chestsFound: "Chests Found",
      trapsLeft: "Traps Left",
      time: "Time",
      score: "Score",
      bestTime: "Best Time",
      leaderboard: "Leaderboard",
      settings: "Settings",
      soundToggle: "Sound",
      languageSelect: "Language",
      gameWon: "Victory! All treasures found!",
      gameLost: "Game Over! You hit a trap!",
      finalScore: "Final Score",
      playAgain: "Play Again",
      mainMenu: "Main Menu",
      statistics: "Statistics",
      gamesPlayed: "Games Played",
      winRate: "Win Rate",
      averageTime: "Average Time",
      questComplete: "Daily Quest Complete!",
      questProgress: "Quest Progress"
    },
    ru: {
      title: "Охотник за сокровищами",
      subtitle: "Найди сокровища, избегай ловушек!",
      difficulty: "Сложность",
      explorer: "Исследователь",
      adventurer: "Авантюрист",
      legend: "Легенда", 
      startGame: "Начать игру",
      newGame: "Новая игра",
      dailyQuest: "Ежедневное задание",
      powerUps: "Усиления",
      lantern: "Фонарь",
      ancientMap: "Древняя карта",
      explorersRope: "Веревка исследователя",
      chestsFound: "Найдено сундуков",
      trapsLeft: "Осталось ловушек",
      time: "Время",
      score: "Очки",
      bestTime: "Лучшее время",
      leaderboard: "Таблица лидеров",
      settings: "Настройки",
      soundToggle: "Звук",
      languageSelect: "Язык",
      gameWon: "Победа! Все сокровища найдены!",
      gameLost: "Игра окончена! Вы попали в ловушку!",
      finalScore: "Финальный счет",
      playAgain: "Играть снова",
      mainMenu: "Главное меню",
      statistics: "Статистика",
      gamesPlayed: "Игр сыграно",
      winRate: "Процент побед",
      averageTime: "Среднее время",
      questComplete: "Ежедневное задание выполнено!",
      questProgress: "Прогресс задания"
    }
  },
  difficulties: {
    explorer: { name: "Explorer", gridSize: 9, traps: 8, chests: 5, multiplier: 1 },
    adventurer: { name: "Adventurer", gridSize: 12, traps: 20, chests: 10, multiplier: 2 },
    legend: { name: "Legend", gridSize: 16, traps: 35, chests: 15, multiplier: 3 }
  },
  dailyQuests: [
    "Find 3 chests without mistakes",
    "Complete Explorer difficulty under 60 seconds", 
    "Win a game using no power-ups",
    "Find 5 chests in a single game",
    "Complete 3 games in a row"
  ]
};

// Game state
let currentLanguage = 'en';
let selectedDifficulty = 'explorer';
let gameBoard = [];
let gameState = 'menu'; // menu, playing, won, lost
let gameStartTime = null;
let gameTimer = null;
let score = 0;
let chestsFound = 0;
let firstClick = true;
let powerUpsUsed = { lantern: 0, ancientMap: 0, explorersRope: 0 };
let activePowerUp = null;
let ropeProtection = false;
let currentQuest = null;
let questProgress = 0;

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  console.log('TreasureSweeper initializing...');
  initializeLanguage();
  initializeEventListeners();
  initializeQuest();
  updateUI();
  loadStatistics();
  selectDifficulty('explorer'); // Set initial difficulty
});

// Language system
function initializeLanguage() {
  const savedLang = localStorage.getItem('treasuresweeper_language') || 'en';
  switchLanguage(savedLang);
}

function switchLanguage(lang) {
  console.log('Switching language to:', lang);
  currentLanguage = lang;
  localStorage.setItem('treasuresweeper_language', lang);
  
  // Update language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update language select
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.value = lang;
  }
  
  // Update all translatable elements
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.dataset.translate;
    if (gameData.translations[lang] && gameData.translations[lang][key]) {
      element.textContent = gameData.translations[lang][key];
    }
  });
  
  // Update document title
  document.title = gameData.translations[lang].title;
  
  updateUI();
}

// Event listeners
function initializeEventListeners() {
  console.log('Initializing event listeners...');
  
  // Language switching
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Language button clicked:', btn.dataset.lang);
      switchLanguage(btn.dataset.lang);
    });
  });
  
  // Difficulty selection
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Difficulty button clicked:', btn.dataset.difficulty);
      selectDifficulty(btn.dataset.difficulty);
    });
  });
  
  // Main menu buttons
  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Start game button clicked');
      startGame();
    });
  }
  
  const leaderboardBtn = document.getElementById('leaderboard-btn');
  if (leaderboardBtn) {
    leaderboardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Leaderboard button clicked');
      showLeaderboard();
    });
  }
  
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Settings button clicked');
      showSettings();
    });
  }
  
  // Game control buttons
  const backToMenuBtn = document.getElementById('back-to-menu');
  if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      backToMenu();
    });
  }
  
  const newGameBtn = document.getElementById('new-game-btn');
  if (newGameBtn) {
    newGameBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startGame();
    });
  }
  
  // Power-up buttons
  document.querySelectorAll('.power-up-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      activatePowerUp(btn.dataset.powerup);
    });
  });
  
  // Modal controls
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });
  
  // End game buttons
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      startGame();
    });
  }
  
  const backToMainBtn = document.getElementById('back-to-main-btn');
  if (backToMainBtn) {
    backToMainBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      backToMenu();
    });
  }
  
  // Leaderboard tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showLeaderboardTab(btn.dataset.difficulty);
    });
  });
  
  // Settings
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('change', toggleSound);
  }
  
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      switchLanguage(e.target.value);
    });
  }
  
  // Modal backdrop clicks
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  });
  
  console.log('Event listeners initialized');
}

// Difficulty selection
function selectDifficulty(difficulty) {
  console.log('Selecting difficulty:', difficulty);
  selectedDifficulty = difficulty;
  
  // Update visual selection
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.difficulty === difficulty) {
      btn.classList.add('selected');
    }
  });
  
  console.log('Difficulty selected:', selectedDifficulty);
}

// Game initialization
function startGame() {
  console.log('Starting game with difficulty:', selectedDifficulty);
  
  gameState = 'playing';
  firstClick = true;
  chestsFound = 0;
  score = 0;
  gameStartTime = Date.now();
  powerUpsUsed = { lantern: 0, ancientMap: 0, explorersRope: 0 };
  activePowerUp = null;
  ropeProtection = false;
  
  // Reset power-ups
  document.querySelectorAll('.power-up-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('active');
    const usesSpan = btn.querySelector('.power-up-uses');
    if (usesSpan) usesSpan.textContent = '1';
  });
  
  initializeBoard();
  startTimer();
  showScreen('game-screen');
  updateUI();
  
  console.log('Game started successfully');
}

function initializeBoard() {
  const config = gameData.difficulties[selectedDifficulty];
  const size = config.gridSize;
  console.log('Initializing board with size:', size);
  
  // Create empty board
  gameBoard = [];
  for (let i = 0; i < size; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < size; j++) {
      gameBoard[i][j] = {
        revealed: false,
        flagged: false,
        trap: false,
        chest: false,
        adjacentCount: 0,
        row: i,
        col: j
      };
    }
  }
  
  renderBoard();
}

function placeTreasuresAndTraps(firstClickRow, firstClickCol) {
  const config = gameData.difficulties[selectedDifficulty];
  const size = config.gridSize;
  const totalCells = size * size;
  const excludedCells = new Set();
  
  // Exclude first click and surrounding cells
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = firstClickRow + dr;
      const nc = firstClickCol + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        excludedCells.add(nr * size + nc);
      }
    }
  }
  
  const availableCells = [];
  for (let i = 0; i < totalCells; i++) {
    if (!excludedCells.has(i)) {
      availableCells.push(i);
    }
  }
  
  // Shuffle available cells
  for (let i = availableCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
  }
  
  // Place chests first
  for (let i = 0; i < config.chests; i++) {
    const cellIndex = availableCells[i];
    const row = Math.floor(cellIndex / size);
    const col = cellIndex % size;
    gameBoard[row][col].chest = true;
  }
  
  // Place traps
  for (let i = config.chests; i < config.chests + config.traps; i++) {
    const cellIndex = availableCells[i];
    const row = Math.floor(cellIndex / size);
    const col = cellIndex % size;
    gameBoard[row][col].trap = true;
  }
  
  // Calculate adjacent counts
  calculateAdjacentCounts();
}

function calculateAdjacentCounts() {
  const size = gameData.difficulties[selectedDifficulty].gridSize;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = i + dr;
          const nc = j + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            if (gameBoard[nr][nc].trap || gameBoard[nr][nc].chest) {
              count++;
            }
          }
        }
      }
      gameBoard[i][j].adjacentCount = count;
    }
  }
}

function renderBoard() {
  const boardElement = document.getElementById('game-board');
  const size = gameData.difficulties[selectedDifficulty].gridSize;
  
  boardElement.className = `game-board size-${size}`;
  boardElement.innerHTML = '';
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = i;
      cell.dataset.col = j;
      
      cell.addEventListener('click', (e) => handleCellClick(e, i, j));
      cell.addEventListener('contextmenu', (e) => handleRightClick(e, i, j));
      
      boardElement.appendChild(cell);
    }
  }
  
  console.log('Board rendered with', size, 'x', size, 'grid');
}

function handleCellClick(e, row, col) {
  e.preventDefault();
  
  if (gameState !== 'playing') return;
  
  const cell = gameBoard[row][col];
  if (cell.revealed || cell.flagged) return;
  
  // Handle power-ups
  if (activePowerUp === 'lantern') {
    useLantern(row, col);
    return;
  }
  
  // First click setup
  if (firstClick) {
    placeTreasuresAndTraps(row, col);
    firstClick = false;
  }
  
  // Handle trap hit
  if (cell.trap && !ropeProtection) {
    hitTrap(row, col);
    return;
  } else if (cell.trap && ropeProtection) {
    // Use rope protection
    ropeProtection = false;
    document.getElementById('explorers-rope-btn').disabled = true;
    document.getElementById('explorers-rope-btn').classList.remove('active');
    showNotification('Explorer\'s Rope saved you!');
    return;
  }
  
  // Reveal cell
  revealCell(row, col);
  
  // Check win condition
  checkWinCondition();
}

function handleRightClick(e, row, col) {
  e.preventDefault();
  
  if (gameState !== 'playing') return;
  
  const cell = gameBoard[row][col];
  if (cell.revealed) return;
  
  // Toggle flag
  cell.flagged = !cell.flagged;
  updateCellDisplay(row, col);
}

function revealCell(row, col) {
  const cell = gameBoard[row][col];
  if (cell.revealed || cell.flagged) return;
  
  cell.revealed = true;
  
  // Handle chest found
  if (cell.chest) {
    chestsFound++;
    score += gameData.difficulties[selectedDifficulty].multiplier * 100;
    updateQuestProgress();
  }
  
  // Auto-reveal empty cells (flood fill)
  if (cell.adjacentCount === 0 && !cell.chest) {
    const size = gameData.difficulties[selectedDifficulty].gridSize;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          revealCell(nr, nc);
        }
      }
    }
  }
  
  updateCellDisplay(row, col);
}

function updateCellDisplay(row, col) {
  const cell = gameBoard[row][col];
  const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  
  if (!cellElement) return;
  
  // Reset classes
  cellElement.className = 'cell';
  cellElement.textContent = '';
  
  if (cell.flagged) {
    cellElement.classList.add('flagged');
  } else if (cell.revealed) {
    cellElement.classList.add('revealed');
    
    if (cell.chest) {
      cellElement.classList.add('chest');
    } else if (cell.trap) {
      cellElement.classList.add('trap');
    } else if (cell.adjacentCount > 0) {
      cellElement.textContent = cell.adjacentCount;
      cellElement.classList.add(`number-${cell.adjacentCount}`);
    }
  }
}

function hitTrap(row, col) {
  gameState = 'lost';
  stopTimer();
  
  // Reveal the trap
  gameBoard[row][col].revealed = true;
  updateCellDisplay(row, col);
  
  // Reveal all traps
  revealAllTraps();
  
  setTimeout(() => {
    showEndGameModal(false);
  }, 1000);
}

function revealAllTraps() {
  const size = gameData.difficulties[selectedDifficulty].gridSize;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (gameBoard[i][j].trap) {
        gameBoard[i][j].revealed = true;
        updateCellDisplay(i, j);
      }
    }
  }
}

function checkWinCondition() {
  const config = gameData.difficulties[selectedDifficulty];
  if (chestsFound === config.chests) {
    gameState = 'won';
    stopTimer();
    
    // Calculate final score
    const timeBonus = Math.max(0, 1000 - Math.floor((Date.now() - gameStartTime) / 1000));
    score += timeBonus * config.multiplier;
    
    // Save to leaderboard
    saveScore();
    
    setTimeout(() => {
      showEndGameModal(true);
    }, 500);
  }
}

// Power-up system
function activatePowerUp(powerUpType) {
  if (gameState !== 'playing') return;
  
  const btn = document.getElementById(`${powerUpType.replace(/([A-Z])/g, '-$1').toLowerCase()}-btn`);
  if (btn && btn.disabled) return;
  
  switch (powerUpType) {
    case 'lantern':
      activePowerUp = 'lantern';
      if (btn) btn.classList.add('active');
      showNotification('Click a cell to reveal 3x3 area');
      break;
      
    case 'ancientMap':
      useAncientMap();
      if (btn) {
        btn.disabled = true;
        const usesSpan = btn.querySelector('.power-up-uses');
        if (usesSpan) usesSpan.textContent = '0';
      }
      break;
      
    case 'explorersRope':
      ropeProtection = true;
      if (btn) {
        btn.classList.add('active');
        btn.disabled = true;
        const usesSpan = btn.querySelector('.power-up-uses');
        if (usesSpan) usesSpan.textContent = '0';
      }
      showNotification('Next trap hit will be ignored');
      break;
  }
}

function useLantern(centerRow, centerCol) {
  const size = gameData.difficulties[selectedDifficulty].gridSize;
  
  // Reveal 3x3 area
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = centerRow + dr;
      const nc = centerCol + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        if (!gameBoard[nr][nc].flagged) {
          revealCell(nr, nc);
        }
      }
    }
  }
  
  // Deactivate lantern
  activePowerUp = null;
  const btn = document.getElementById('lantern-btn');
  if (btn) {
    btn.disabled = true;
    btn.classList.remove('active');
    const usesSpan = btn.querySelector('.power-up-uses');
    if (usesSpan) usesSpan.textContent = '0';
  }
  
  checkWinCondition();
}

function useAncientMap() {
  const size = gameData.difficulties[selectedDifficulty].gridSize;
  
  // Highlight risky cells (cells adjacent to traps)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!gameBoard[i][j].revealed && !gameBoard[i][j].flagged) {
        let nearTraps = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = i + dr;
            const nc = j + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && gameBoard[nr][nc].trap) {
              nearTraps++;
            }
          }
        }
        
        if (nearTraps > 0) {
          const cellElement = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
          if (cellElement) {
            cellElement.classList.add('risky');
            
            // Remove highlight after 5 seconds
            setTimeout(() => {
              cellElement.classList.remove('risky');
            }, 5000);
          }
        }
      }
    }
  }
  
  showNotification('Risky cells highlighted for 5 seconds');
}

// Timer system
function startTimer() {
  gameTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timerElement = document.getElementById('game-timer');
    if (timerElement) {
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function stopTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

// Quest system
function initializeQuest() {
  const today = new Date().toDateString();
  const savedQuest = localStorage.getItem('treasuresweeper_daily_quest');
  const savedDate = localStorage.getItem('treasuresweeper_quest_date');
  
  if (savedDate !== today) {
    // New day, generate new quest
    const questIndex = Math.floor(Math.random() * gameData.dailyQuests.length);
    currentQuest = gameData.dailyQuests[questIndex];
    questProgress = 0;
    
    localStorage.setItem('treasuresweeper_daily_quest', currentQuest);
    localStorage.setItem('treasuresweeper_quest_date', today);
    localStorage.setItem('treasuresweeper_quest_progress', '0');
  } else {
    currentQuest = savedQuest || gameData.dailyQuests[0];
    questProgress = parseInt(localStorage.getItem('treasuresweeper_quest_progress') || '0');
  }
}

function updateQuestProgress() {
  if (!currentQuest) return;
  
  if (currentQuest.includes('Find 3 chests without mistakes') && chestsFound <= 3) {
    questProgress = chestsFound;
  } else if (currentQuest.includes('Find 5 chests in a single game')) {
    questProgress = Math.min(chestsFound, 5);
  }
  
  localStorage.setItem('treasuresweeper_quest_progress', questProgress.toString());
  updateUI();
  
  // Check if quest completed
  if ((currentQuest.includes('Find 3 chests') && questProgress >= 3) ||
      (currentQuest.includes('Find 5 chests') && questProgress >= 5)) {
    showNotification(gameData.translations[currentLanguage].questComplete);
  }
}

// Leaderboard system
function saveScore() {
  const config = gameData.difficulties[selectedDifficulty];
  const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
  
  const entry = {
    score: score,
    time: gameTime,
    difficulty: selectedDifficulty,
    date: new Date().toISOString()
  };
  
  const leaderboard = JSON.parse(localStorage.getItem('treasuresweeper_leaderboard') || '[]');
  leaderboard.push(entry);
  
  // Sort by score (descending)
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Keep top 50 entries
  leaderboard.splice(50);
  
  localStorage.setItem('treasuresweeper_leaderboard', JSON.stringify(leaderboard));
  
  // Update statistics
  updateStatistics(gameState === 'won', gameTime);
}

function updateStatistics(won, gameTime) {
  const stats = JSON.parse(localStorage.getItem('treasuresweeper_stats') || '{}');
  
  stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
  stats.gamesWon = (stats.gamesWon || 0) + (won ? 1 : 0);
  stats.totalTime = (stats.totalTime || 0) + gameTime;
  
  if (won) {
    if (!stats.bestTime || gameTime < stats.bestTime) {
      stats.bestTime = gameTime;
    }
  }
  
  localStorage.setItem('treasuresweeper_stats', JSON.stringify(stats));
}

function loadStatistics() {
  const stats = JSON.parse(localStorage.getItem('treasuresweeper_stats') || '{}');
  
  const gamesPlayedEl = document.getElementById('games-played');
  if (gamesPlayedEl) gamesPlayedEl.textContent = stats.gamesPlayed || 0;
  
  const winRate = stats.gamesPlayed ? Math.round((stats.gamesWon || 0) / stats.gamesPlayed * 100) : 0;
  const winRateEl = document.getElementById('win-rate');
  if (winRateEl) winRateEl.textContent = `${winRate}%`;
  
  const avgTime = stats.gamesPlayed ? Math.floor((stats.totalTime || 0) / stats.gamesPlayed) : 0;
  const avgMinutes = Math.floor(avgTime / 60);
  const avgSeconds = avgTime % 60;
  const avgTimeEl = document.getElementById('avg-time');
  if (avgTimeEl) {
    avgTimeEl.textContent = `${avgMinutes.toString().padStart(2, '0')}:${avgSeconds.toString().padStart(2, '0')}`;
  }
  
  const bestTimeEl = document.getElementById('best-time');
  if (bestTimeEl && stats.bestTime) {
    const bestMinutes = Math.floor(stats.bestTime / 60);
    const bestSeconds = stats.bestTime % 60;
    bestTimeEl.textContent = `${bestMinutes.toString().padStart(2, '0')}:${bestSeconds.toString().padStart(2, '0')}`;
  }
}

// UI Management
function showScreen(screenId) {
  console.log('Showing screen:', screenId);
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
  }
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
}

function updateUI() {
  // Update quest display
  if (currentQuest) {
    const questTextEl = document.getElementById('daily-quest-text');
    if (questTextEl) questTextEl.textContent = currentQuest;
    
    const maxProgress = currentQuest.includes('Find 3 chests') ? 3 : 
                       currentQuest.includes('Find 5 chests') ? 5 : 1;
    const questProgressEl = document.getElementById('quest-progress');
    if (questProgressEl) questProgressEl.textContent = `${questProgress}/${maxProgress}`;
  }
  
  // Update game stats
  if (gameState === 'playing') {
    const config = gameData.difficulties[selectedDifficulty];
    
    const chestsFoundEl = document.getElementById('chests-found');
    if (chestsFoundEl) chestsFoundEl.textContent = chestsFound;
    
    const totalChestsEl = document.getElementById('total-chests');
    if (totalChestsEl) totalChestsEl.textContent = config.chests;
    
    const trapsLeftEl = document.getElementById('traps-left');
    if (trapsLeftEl) trapsLeftEl.textContent = config.traps;
    
    const currentScoreEl = document.getElementById('current-score');
    if (currentScoreEl) currentScoreEl.textContent = score;
  }
}

function showEndGameModal(won) {
  const modal = document.getElementById('end-game-modal');
  const title = document.getElementById('end-game-title');
  
  if (title) {
    title.textContent = won ? 
      gameData.translations[currentLanguage].gameWon : 
      gameData.translations[currentLanguage].gameLost;
  }
  
  const finalScoreEl = document.getElementById('final-score');
  if (finalScoreEl) finalScoreEl.textContent = score;
  
  const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;
  const finalTimeEl = document.getElementById('final-time');
  if (finalTimeEl) {
    finalTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  const finalChestsEl = document.getElementById('final-chests');
  if (finalChestsEl) finalChestsEl.textContent = chestsFound;
  
  showModal('end-game-modal');
}

function showLeaderboard() {
  showLeaderboardTab('explorer');
  showModal('leaderboard-modal');
}

function showLeaderboardTab(difficulty) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
  });
  
  // Load and display leaderboard
  const leaderboard = JSON.parse(localStorage.getItem('treasuresweeper_leaderboard') || '[]');
  const filtered = leaderboard.filter(entry => entry.difficulty === difficulty).slice(0, 10);
  
  const content = document.getElementById('leaderboard-content');
  if (!content) return;
  
  content.innerHTML = '';
  
  if (filtered.length === 0) {
    content.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No scores yet</p>';
    return;
  }
  
  filtered.forEach((entry, index) => {
    const entryElement = document.createElement('div');
    entryElement.className = 'leaderboard-entry';
    
    const minutes = Math.floor(entry.time / 60);
    const seconds = entry.time % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    entryElement.innerHTML = `
      <span class="leaderboard-rank">${index + 1}</span>
      <span class="leaderboard-name">Player</span>
      <span class="leaderboard-score">${entry.score} (${timeStr})</span>
    `;
    
    content.appendChild(entryElement);
  });
}

function showSettings() {
  loadStatistics();
  showModal('settings-modal');
}

function toggleSound(e) {
  localStorage.setItem('treasuresweeper_sound', e.target.checked);
}

function backToMenu() {
  stopTimer();
  gameState = 'menu';
  showScreen('main-menu');
}

function showNotification(message) {
  // Simple notification system
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-card-bg);
    color: var(--color-text);
    padding: 12px 20px;
    border-radius: 8px;
    border: 1px solid var(--color-treasure);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 3000;
    font-size: 14px;
    max-width: 300px;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}