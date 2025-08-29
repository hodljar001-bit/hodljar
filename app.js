// Application data and translations
const appData = {
  tokenomics: {
    totalSupply: "100,000,000",
    distribution: {
      communityRewards: 40,
      liquidity: 30,
      team: 15,
      marketing: 10,
      treasury: 5
    }
  },
  translations: {
    en: {
      title: "HODLJAR - The Treasure Hunter's Meme Coin",
      tagline: "HODL your way to digital treasure",
      joinTreasureHunt: "Join the Treasure Hunt",
      connectWallet: "Connect Wallet",
      home: "Home",
      about: "About",
      tokenomics: "Tokenomics",
      treasureHunt: "Treasure Hunt",
      community: "Community",
      totalSupply: "Total Supply",
      communityRewards: "Community Rewards & Missions",
      liquidityExchange: "Liquidity & Exchange Listings",
      teamAllocation: "Team (locked 12 months)",
      marketingPartnerships: "Marketing & Partnerships",
      treasuryDevelopment: "Treasury & Development",
      aboutDesc1: "HODLJAR combines the legendary \"HODL\" mentality with the thrill of treasure hunting in the digital age. Our gamified ecosystem rewards patient investors and active community members through on-chain treasure hunts and exclusive NFT artifacts.",
      aboutDesc2: "Built on Solana for lightning-fast transactions and low fees, HODLJAR creates a unique social experience where every holder becomes an explorer in search of digital riches.",
      gamifiedTitle: "Gamified Experience",
      gamifiedDesc: "Complete missions, solve puzzles, and hunt for treasure to earn rewards",
      proofHodlTitle: "Proof of HODL",
      proofHodlDesc: "Seasonal rewards for loyal holders who weather market storms",
      communityTitle: "Community Driven",
      communityDesc: "Fair launch, transparent tokenomics, and community governance",
      leaderboard: "Leaderboard",
      communityMembers: "Community Members",
      activeHolders: "Active Holders",
      activeTreasureHunts: "Active Treasure Hunts",
      walletConnected: "Wallet Connected",
      disconnect: "Disconnect",
      participants: "participants",
      timeLeft: "Time left"
    },
    ru: {
      title: "HODLJAR - Мем-монета охотников за сокровищами",
      tagline: "HODL свой путь к цифровым сокровищам",
      joinTreasureHunt: "Присоединиться к охоте за сокровищами",
      connectWallet: "Подключить кошелек",
      home: "Главная",
      about: "О проекте",
      tokenomics: "Токеномика",
      treasureHunt: "Охота за сокровищами",
      community: "Сообщество",
      totalSupply: "Общее предложение",
      communityRewards: "Награды сообщества и миссии",
      liquidityExchange: "Ликвидность и листинги на биржах",
      teamAllocation: "Команда (заблокировано на 12 месяцев)",
      marketingPartnerships: "Маркетинг и партнерство",
      treasuryDevelopment: "Казначейство и разработка",
      aboutDesc1: "HODLJAR сочетает легендарную ментальность \"HODL\" с азартом охоты за сокровищами в цифровую эпоху. Наша игровая экосистема вознаграждает терпеливых инвесторов и активных участников сообщества через он-чейн охоту за сокровищами и эксклюзивные NFT артефакты.",
      aboutDesc2: "Построенный на Solana для молниеносных транзакций и низких комиссий, HODLJAR создает уникальный социальный опыт, где каждый держатель становится исследователем в поисках цифровых богатств.",
      gamifiedTitle: "Игровой опыт",
      gamifiedDesc: "Выполняйте миссии, решайте головоломки и охотьтесь за сокровищами, чтобы получать награды",
      proofHodlTitle: "Доказательство HODL",
      proofHodlDesc: "Сезонные награды для верных держателей, переживших рыночные бури",
      communityTitle: "Управляемый сообществом",
      communityDesc: "Честный запуск, прозрачная токеномика и управление сообществом",
      leaderboard: "Таблица лидеров",
      communityMembers: "Участники сообщества",
      activeHolders: "Активные держатели",
      activeTreasureHunts: "Активные охоты за сокровищами",
      walletConnected: "Кошелек подключен",
      disconnect: "Отключить",
      participants: "участников",
      timeLeft: "Осталось времени"
    }
  },
  mockData: {
    stats: {
      price: "$0.00142",
      marketCap: "$142,000",
      holders: "15,847",
      communityMembers: "23,456"
    },
    treasureHunts: [
      {name: "Golden Chest Quest", reward: "10,000 HJAR", participants: 1205, timeLeft: "2d 14h"},
      {name: "Ancient Map Hunt", reward: "5,000 HJAR", participants: 856, timeLeft: "5d 8h"},
      {name: "Explorer's Challenge", reward: "25,000 HJAR", participants: 2341, timeLeft: "12h 42m"}
    ],
    leaderboard: [
      {rank: 1, user: "TreasureHunter21", score: 15420},
      {rank: 2, user: "GoldDigger88", score: 12890},
      {rank: 3, user: "ExplorerXYZ", score: 11750},
      {rank: 4, user: "PirateKing", score: 9980},
      {rank: 5, user: "MapReader", score: 8765}
    ]
  }
};

// Application state
let currentLanguage = 'en';
let isWalletConnected = false;
let connectedWallet = null;
let tokenomicsChart = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeLanguage();
  initializeEventListeners();
  initializeTokenomicsChart();
  populateTreasureHunts();
  populateLeaderboard();
  initializeSmoothScrolling();
  initializeInteractiveEffects();
});

// Language switching functionality
function initializeLanguage() {
  console.log('Initializing language...');
  const savedLang = sessionStorage.getItem('selectedLanguage') || 'en';
  switchLanguage(savedLang);
}

function switchLanguage(lang) {
  console.log('Switching language to:', lang);
  currentLanguage = lang;
  sessionStorage.setItem('selectedLanguage', lang);
  
  // Update language buttons
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update all translatable elements
  const elements = document.querySelectorAll('[data-translate]');
  elements.forEach(element => {
    const key = element.dataset.translate;
    if (appData.translations[lang] && appData.translations[lang][key]) {
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = appData.translations[lang][key];
      } else {
        element.textContent = appData.translations[lang][key];
      }
    }
  });
  
  // Update document title
  document.title = appData.translations[lang].title;
  
  // Re-populate dynamic content with new language
  populateTreasureHunts();
  populateLeaderboard();
  
  // Update chart labels if chart exists
  if (tokenomicsChart) {
    tokenomicsChart.data.labels = [
      appData.translations[lang].communityRewards,
      appData.translations[lang].liquidityExchange,
      appData.translations[lang].teamAllocation,
      appData.translations[lang].marketingPartnerships,
      appData.translations[lang].treasuryDevelopment
    ];
    tokenomicsChart.update();
  }
}

// Event listeners initialization
function initializeEventListeners() {
  console.log('Initializing event listeners...');
  
  // Language switching
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Language button clicked:', btn.dataset.lang);
      switchLanguage(btn.dataset.lang);
    });
  });
  
  // Wallet connection
  const connectWalletBtn = document.querySelector('.connect-wallet-btn');
  const walletModal = document.getElementById('wallet-modal');
  const modalClose = document.querySelector('.modal-close');
  
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Connect wallet button clicked');
      handleWalletConnection();
    });
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }
  
  if (walletModal) {
    walletModal.addEventListener('click', (e) => {
      if (e.target === walletModal) {
        closeModal();
      }
    });
  }
  
  // Wallet options
  const walletOptions = document.querySelectorAll('.wallet-option');
  walletOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Wallet option clicked:', option.dataset.wallet);
      connectWallet(option.dataset.wallet);
    });
  });
  
  // Treasure hunt button
  const treasureHuntBtn = document.querySelector('.treasure-hunt-btn');
  if (treasureHuntBtn) {
    treasureHuntBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Treasure hunt button clicked');
      const treasureSection = document.getElementById('treasure-hunt');
      if (treasureSection) {
        treasureSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// Smooth scrolling for navigation
function initializeSmoothScrolling() {
  console.log('Initializing smooth scrolling...');
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      console.log('Nav link clicked, target:', targetId);
      
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Wallet connection functionality
function handleWalletConnection() {
  if (isWalletConnected) {
    disconnectWallet();
  } else {
    openWalletModal();
  }
}

function openWalletModal() {
  console.log('Opening wallet modal');
  const walletModal = document.getElementById('wallet-modal');
  if (walletModal) {
    walletModal.classList.remove('hidden');
  }
}

function closeModal() {
  console.log('Closing modal');
  const walletModal = document.getElementById('wallet-modal');
  if (walletModal) {
    walletModal.classList.add('hidden');
  }
}

function connectWallet(walletType) {
  console.log('Connecting wallet:', walletType);
  
  // Show loading state
  showWalletLoading(walletType);
  
  // Mock wallet connection
  setTimeout(() => {
    isWalletConnected = true;
    connectedWallet = walletType;
    
    // Generate mock wallet address
    const mockAddress = generateMockAddress();
    
    // Update connect button
    updateConnectButton(mockAddress);
    
    closeModal();
    
    // Reset wallet options
    resetWalletOptions();
    
    console.log(`Connected to ${walletType} wallet: ${mockAddress}`);
  }, 2000);
}

function disconnectWallet() {
  console.log('Disconnecting wallet');
  isWalletConnected = false;
  connectedWallet = null;
  
  // Reset connect button
  const connectWalletBtn = document.querySelector('.connect-wallet-btn');
  if (connectWalletBtn) {
    connectWalletBtn.textContent = appData.translations[currentLanguage].connectWallet;
    connectWalletBtn.classList.remove('connected');
  }
}

function updateConnectButton(address) {
  const connectWalletBtn = document.querySelector('.connect-wallet-btn');
  if (connectWalletBtn) {
    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    connectWalletBtn.textContent = truncatedAddress;
    connectWalletBtn.classList.add('connected');
  }
}

function showWalletLoading(walletType) {
  const option = document.querySelector(`[data-wallet="${walletType}"]`);
  if (option) {
    option.innerHTML = `
      <div class="loading-spinner"></div>
      <span>Connecting...</span>
    `;
    option.disabled = true;
  }
}

function resetWalletOptions() {
  const walletOptions = document.querySelectorAll('.wallet-option');
  walletOptions.forEach(option => {
    const walletType = option.dataset.wallet;
    const walletIcon = walletType === 'phantom' ? '👻' : '🔥';
    const walletName = walletType.charAt(0).toUpperCase() + walletType.slice(1);
    
    option.innerHTML = `
      <span class="wallet-icon">${walletIcon}</span>
      <span class="wallet-name">${walletName}</span>
    `;
    option.disabled = false;
  });
}

function generateMockAddress() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Tokenomics chart initialization
function initializeTokenomicsChart() {
  console.log('Initializing tokenomics chart...');
  const canvas = document.getElementById('tokenomicsChart');
  if (!canvas) {
    console.error('Chart canvas not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  
  const data = {
    labels: [
      appData.translations[currentLanguage].communityRewards,
      appData.translations[currentLanguage].liquidityExchange,
      appData.translations[currentLanguage].teamAllocation,
      appData.translations[currentLanguage].marketingPartnerships,
      appData.translations[currentLanguage].treasuryDevelopment
    ],
    datasets: [{
      data: [40, 30, 15, 10, 5],
      backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
      borderColor: '#FFD700',
      borderWidth: 2
    }]
  };
  
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1a1a1a',
          titleColor: '#FFD700',
          bodyColor: '#f5f5f5',
          borderColor: '#FFD700',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      },
      cutout: '60%'
    }
  };
  
  tokenomicsChart = new Chart(ctx, config);
  console.log('Chart initialized successfully');
}

// Populate treasure hunts
function populateTreasureHunts() {
  const huntsGrid = document.getElementById('hunts-grid');
  if (!huntsGrid) return;
  
  huntsGrid.innerHTML = '';
  
  const treasureIcons = ['🗝️', '🏴‍☠️', '⚔️'];
  
  appData.mockData.treasureHunts.forEach((hunt, index) => {
    const huntCard = document.createElement('div');
    huntCard.className = 'hunt-card';
    
    huntCard.innerHTML = `
      <h3 class="hunt-title">
        <span>${treasureIcons[index]}</span>
        ${hunt.name}
      </h3>
      <div class="hunt-reward">${hunt.reward}</div>
      <div class="hunt-participants">${hunt.participants} ${appData.translations[currentLanguage].participants}</div>
      <div class="hunt-timer">${appData.translations[currentLanguage].timeLeft}: ${hunt.timeLeft}</div>
    `;
    
    huntsGrid.appendChild(huntCard);
  });
}

// Populate leaderboard
function populateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  if (!leaderboardList) return;
  
  leaderboardList.innerHTML = '';
  
  const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  
  appData.mockData.leaderboard.forEach((entry, index) => {
    const leaderboardItem = document.createElement('div');
    leaderboardItem.className = 'leaderboard-item';
    
    leaderboardItem.innerHTML = `
      <span class="leaderboard-rank">${rankEmojis[index]}</span>
      <span class="leaderboard-user">${entry.user}</span>
      <span class="leaderboard-score">${entry.score.toLocaleString()}</span>
    `;
    
    leaderboardList.appendChild(leaderboardItem);
  });
}

// Interactive effects
function initializeInteractiveEffects() {
  // Add hover effects to cards
  const cards = document.querySelectorAll('.feature-card, .hunt-card, .community-stat');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Add glow effect to treasure chest on hover
  const treasureChest = document.querySelector('.treasure-chest');
  if (treasureChest) {
    treasureChest.addEventListener('mouseenter', function() {
      this.style.filter = 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))';
    });
    
    treasureChest.addEventListener('mouseleave', function() {
      this.style.filter = 'none';
    });
  }
}

// Dynamic stats updates (mock)
function updateStats() {
  const priceElement = document.getElementById('token-price');
  const marketCapElement = document.getElementById('market-cap');
  const holdersElement = document.getElementById('holders');
  
  // Simulate price fluctuations
  const basePrice = 0.00142;
  const variation = (Math.random() - 0.5) * 0.0001;
  const newPrice = basePrice + variation;
  
  if (priceElement) {
    priceElement.textContent = `$${newPrice.toFixed(5)}`;
  }
  
  // Simulate holder growth
  const currentHolders = parseInt(appData.mockData.stats.holders.replace(',', ''));
  const newHolders = currentHolders + Math.floor(Math.random() * 10);
  
  if (holdersElement) {
    holdersElement.textContent = newHolders.toLocaleString();
  }
  
  // Update market cap based on new price
  const totalSupply = 100000000;
  const marketCap = (newPrice * totalSupply).toFixed(0);
  
  if (marketCapElement) {
    marketCapElement.textContent = `$${parseInt(marketCap).toLocaleString()}`;
  }
}

// Update stats periodically
setInterval(updateStats, 30000);

// Scroll-based animations and navigation highlighting
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  
  // Update navigation active state
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.clientHeight;
    
    if (scrolled >= sectionTop && scrolled < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Export functions for potential external use
window.hodljarApp = {
  switchLanguage,
  connectWallet,
  disconnectWallet,
  updateStats
};