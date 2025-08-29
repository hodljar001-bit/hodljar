// HODLJAR with integrated TreasureSweeper game
const siteData = {
  translations: {
    en: {
      title: "HODLJAR - The Treasure Hunter's Meme Coin",
      tagline: "HODL your way to digital treasure",
      home: "Home",
      about: "About",
      tokenomics: "Tokenomics", 
      treasureSweeper: "TreasureSweeper",
      community: "Community",
      connectWallet: "Connect Wallet",
      joinTreasureHunt: "Join the Treasure Hunt",
      totalSupply: "Total Supply",
      communityRewards: "Community Rewards & Missions",
      liquidityExchange: "Liquidity & Exchange Listings",
      teamAllocation: "Team (locked 12 months)",
      marketingPartnerships: "Marketing & Partnerships",
      treasuryDevelopment: "Treasury & Development",
      aboutDesc1: "HODLJAR combines the legendary HODL mentality with the thrill of treasure hunting in the digital age. Our gamified ecosystem rewards patient investors and active community members through on-chain treasure hunts and exclusive NFT artifacts.",
      aboutDesc2: "Built on Solana for lightning-fast transactions and low fees, HODLJAR creates a unique social experience where every holder becomes an explorer in search of digital riches.",
      gameTitle: "TreasureSweeper Game",
      gameSubtitle: "Find the treasure, avoid the traps!",
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
      gameWon: "Victory! All treasures found!",
      gameLost: "Game Over! You hit a trap!",
      playAgain: "Play Again",
      backToSite: "Back to HODLJAR",
      finalScore: "Final Score",
      questProgress: "Quest Progress"
    },
    ru: {
      title: "HODLJAR - Мем-монета охотников за сокровищами",
      tagline: "HODL свой путь к цифровым сокровищам",
      home: "Главная",
      about: "О проекте",
      tokenomics: "Токеномика",
      treasureSweeper: "Охотник за сокровищами", 
      community: "Сообщество",
      connectWallet: "Подключить кошелек",
      joinTreasureHunt: "Присоединиться к охоте за сокровищами",
      totalSupply: "Общее предложение",
      communityRewards: "Награды сообщества и миссии",
      liquidityExchange: "Ликвидность и листинги на биржах",
      teamAllocation: "Команда (заблокировано на 12 месяцев)",
      marketingPartnerships: "Маркетинг и партнерство",
      treasuryDevelopment: "Казначейство и разработка",
      aboutDesc1: "HODLJAR объединяет легендарную ментальность HODL с азартом охоты за сокровищами в цифровую эпоху. Наша игровая экосистема вознаграждает терпеливых инвесторов и активных участников сообщества через он-чейн охоту за сокровищами и эксклюзивные NFT артефакты.",
      aboutDesc2: "Построенный на Solana для молниеносных транзакций и низких комиссий, HODLJAR создает уникальный социальный опыт, где каждый держатель становится исследователем в поисках цифровых богатств.",
      gameTitle: "Игра Охотник за сокровищами",
      gameSubtitle: "Найди сокровища, избегай ловушек!",
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
      gameWon: "Победа! Все сокровища найдены!",
      gameLost: "Игра окончена! Вы попали в ловушку!",
      playAgain: "Играть снова",
      backToSite: "Вернуться на HODLJAR",
      finalScore: "Финальный счет",
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

// Global state
let currentLanguage = 'en';
let currentSection = 'home';
let walletConnected = false;
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

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('HODLJAR initializing...');
  initializeLanguage();
  initializeEventListeners();
  initializeQuest();
  updateUI();
  showSection('home');
});

// Language system
function initializeLanguage() {
  const savedLang = localStorage.getItem('hodljar_language') || 'en';
  switchLanguage(savedLang);
}

function switchLanguage(lang) {
  console.log('Switching language to:', lang);
  currentLanguage = lang;
  localStorage.setItem('hodljar_language', lang);
  
  // Update language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update all translatable elements
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.dataset.translate;
    if (siteData.translations[lang] && siteData.translations[lang][key]) {
      element.textContent = siteData.translations[lang][key];
    }
  });
  
  // Update document title
  document.title = siteData.translations[lang].title;
  
  updateUI();
}

// Navigation system
function showSection(sectionId) {
  console.log('Showing section:', sectionId);
  currentSection = sectionId;
  
  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
  
  // Update page sections
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.toggle('active', section.id === sectionId);
  });
  
  // Handle game section
  if (sectionId === 'treasuresweeper') {
    showGameScreen('game-menu');
  } else {
    // Reset game when leaving
    if (gameTimer) stopTimer();
    gameState = 'menu';
  }
}

function showGameScreen(screenId) {
  console.log('Showing game screen:', screenId);
  
  // Hide all game screens
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
  }
}

// Event listeners
function initializeEventListeners() {
  console.log('Initializing event listeners...');
  
  // Language switching
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchLanguage(btn.dataset.lang);
    });
  });
  
  // Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });
  
  // Game navigation buttons
  document.querySelectorAll('.game-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showSection('treasuresweeper');
    });
  });
  
  // Wallet connection
  const connectWalletBtn = document.getElementById('connect-wallet');
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('wallet-modal');
    });
  }
  
  // Wallet options
  document.querySelectorAll('.wallet-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      connectWallet(option.dataset.wallet);
    });
  });
  
  // Difficulty selection
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectDifficulty(btn.dataset.difficulty);
    });
  });
  
  // Game control buttons
  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startGame();
    });
  }
  
  const backToGameMenuBtn = document.getElementById('back-to-game-menu');
  if (backToGameMenuBtn) {
    backToGameMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      backToGameMenu();
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
  
  const backToSiteBtn = document.getElementById('back-to-site-btn');
  if (backToSiteBtn) {
    backToSiteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      showSection('home');
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

// Wallet functionality
function connectWallet(walletType) {
  console.log('Connecting wallet:', walletType);
  walletConnected = true;
  
  // Update connect button
  const connectBtn = document.getElementById('connect-wallet');
  if (connectBtn) {
    connectBtn.textContent = `${walletType.charAt(0).toUpperCase() + walletType.slice(1)} Connected`;
    connectBtn.classList.add('connected');
  }
  
  closeModal();
  showNotification(`${walletType.charAt(0).toUpperCase() + walletType.slice(1)} wallet connected successfully!`);
}

// Game difficulty selection
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
}

// Game functionality
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
  showGameScreen('game-playing');
  updateUI();
}

function initializeBoard() {
  const config = siteData.difficulties[selectedDifficulty];
  const size = config.gridSize;
  
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
  const config = siteData.difficulties[selectedDifficulty];
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
  const size = siteData.difficulties[selectedDifficulty].gridSize;
  
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
  const size = siteData.difficulties[selectedDifficulty].gridSize;
  
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
    score += siteData.difficulties[selectedDifficulty].multiplier * 100;
    updateQuestProgress();
  }
  
  // Auto-reveal empty cells (flood fill)
  if (cell.adjacentCount === 0 && !cell.chest) {
    const size = siteData.difficulties[selectedDifficulty].gridSize;
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
  const size = siteData.difficulties[selectedDifficulty].gridSize;
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
  const config = siteData.difficulties[selectedDifficulty];
  if (chestsFound === config.chests) {
    gameState = 'won';
    stopTimer();
    
    // Calculate final score
    const timeBonus = Math.max(0, 1000 - Math.floor((Date.now() - gameStartTime) / 1000));
    score += timeBonus * config.multiplier;
    
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
  const size = siteData.difficulties[selectedDifficulty].gridSize;
  
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
  const size = siteData.difficulties[selectedDifficulty].gridSize;
  
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
  const savedQuest = localStorage.getItem('hodljar_daily_quest');
  const savedDate = localStorage.getItem('hodljar_quest_date');
  
  if (savedDate !== today) {
    // New day, generate new quest
    const questIndex = Math.floor(Math.random() * siteData.dailyQuests.length);
    currentQuest = siteData.dailyQuests[questIndex];
    questProgress = 0;
    
    localStorage.setItem('hodljar_daily_quest', currentQuest);
    localStorage.setItem('hodljar_quest_date', today);
    localStorage.setItem('hodljar_quest_progress', '0');
  } else {
    currentQuest = savedQuest || siteData.dailyQuests[0];
    questProgress = parseInt(localStorage.getItem('hodljar_quest_progress') || '0');
  }
}

function updateQuestProgress() {
  if (!currentQuest) return;
  
  if (currentQuest.includes('Find 3 chests without mistakes') && chestsFound <= 3) {
    questProgress = chestsFound;
  } else if (currentQuest.includes('Find 5 chests in a single game')) {
    questProgress = Math.min(chestsFound, 5);
  }
  
  localStorage.setItem('hodljar_quest_progress', questProgress.toString());
  updateUI();
  
  // Check if quest completed
  if ((currentQuest.includes('Find 3 chests') && questProgress >= 3) ||
      (currentQuest.includes('Find 5 chests') && questProgress >= 5)) {
    showNotification(siteData.translations[currentLanguage].questComplete || 'Daily Quest Complete!');
  }
}

// UI Management
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
    const config = siteData.difficulties[selectedDifficulty];
    
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
      siteData.translations[currentLanguage].gameWon : 
      siteData.translations[currentLanguage].gameLost;
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

function backToGameMenu() {
  stopTimer();
  gameState = 'menu';
  showGameScreen('game-menu');
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
    backdrop-filter: blur(10px);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}