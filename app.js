// Application State
let settings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  interval: 4,
  autoMusic: true,
  soundAlert: true,
  ytLinks: {
    pomodoro: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
    shortBreak: 'https://www.youtube.com/watch?v=BTYAsjAVa3I',
    longBreak: 'https://www.youtube.com/watch?v=r6VwPZqB4Wc'
  }
};

let stats = {
  cycles: 0,
  focusTime: 0
};

let tasks = [];
let activeTaskId = null;
let dailyHistory = {};

// Collapsible task list states
let todoListOpen = true;
let completedListOpen = false;

// Timer Variables
let currentMode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
let timeLeft = 25 * 60;       // in seconds
let duration = 25 * 60;       // initial duration in seconds
let timerInterval = null;
let isPlaying = false;
let isTransitioningMode = false;
let endTime = null;           // Target timestamp for accurate countdown

// Audio/YouTube Player State
let musicEnabled = true;
let ytPlayer = null;
let ytPlayerReady = false;
let currentLoadedVideoId = '';
let isVideoCued = false;

// DOM Elements
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const skipBtn = document.getElementById('skip-btn');
const activeTaskLabel = document.getElementById('active-task-label');
const tabButtons = document.querySelectorAll('.tab-btn');

// Music Elements
const youtubeLinkInput = document.getElementById('youtube-link-input');
const audioPlayer = document.getElementById('audio-player-element');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const musicPlayIcon = document.getElementById('music-play-icon');
const musicPauseIcon = document.getElementById('music-pause-icon');
const musicTitle = document.getElementById('music-title');
const musicStatus = document.getElementById('music-status');

// Stats Elements
const cyclesCompletedDisplay = document.getElementById('cycles-completed');
const totalFocusTimeDisplay = document.getElementById('total-focus-time');
const progressBar = document.getElementById('progress-bar');

// Task Elements
const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');
const emptyState = document.getElementById('empty-state');
const tasksCountDisplay = document.getElementById('tasks-count');

// Settings Modal Elements
const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');
const settingsCancelBtn = document.getElementById('settings-cancel-btn');
const settingsSaveBtn = document.getElementById('settings-save-btn');

const settingPomodoro = document.getElementById('setting-pomodoro');
const settingShortBreak = document.getElementById('setting-short-break');
const settingLongBreak = document.getElementById('setting-long-break');
const settingInterval = document.getElementById('setting-interval');
const settingAutoMusic = document.getElementById('setting-auto-music');
const settingSoundAlert = document.getElementById('setting-sound-alert');

// -------------------------------------------------------------
// 1. Initialisation & LocalStorage
// -------------------------------------------------------------
function init() {
  loadFromLocalStorage();
  setupEventListeners();
  resetTimer(currentMode);
  renderTasks();
  updateStatsDisplay();
  renderContributionGraph();
  
  // Asynchronously inject YouTube Player API Script
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function loadFromLocalStorage() {
  const savedSettings = localStorage.getItem('greenporo_settings');
  if (savedSettings) {
    const parsed = JSON.parse(savedSettings);
    // Safe merge settings to include new default ytLinks fields
    settings = {
      ...settings,
      ...parsed,
      ytLinks: {
        ...settings.ytLinks,
        ...(parsed.ytLinks || {})
      }
    };
  }
  
  // Migration: Replace old dead default YouTube links with new stable ones
  let migrated = false;
  if (settings.ytLinks) {
    if (settings.ytLinks.pomodoro === 'https://www.youtube.com/watch?v=tNkZsEC7B9g' || 
        settings.ytLinks.pomodoro === 'https://www.youtube.com/watch?v=lTRruu-STEA') {
      settings.ytLinks.pomodoro = 'https://www.youtube.com/watch?v=lTRiuFIWV54';
      migrated = true;
    }
    if (settings.ytLinks.shortBreak === 'https://www.youtube.com/watch?v=mPhYyv7-6kY' || 
        settings.ytLinks.shortBreak === 'https://www.youtube.com/watch?v=kYJj-4yvP5A') {
      settings.ytLinks.shortBreak = 'https://www.youtube.com/watch?v=BTYAsjAVa3I';
      migrated = true;
    }
    if (settings.ytLinks.longBreak === 'https://www.youtube.com/watch?v=Dx5qFedd3Y4' || 
        settings.ytLinks.longBreak === 'https://www.youtube.com/watch?v=vVj4u_3nN8s') {
      settings.ytLinks.longBreak = 'https://www.youtube.com/watch?v=r6VwPZqB4Wc';
      migrated = true;
    }
  }
  if (migrated) {
    saveSettingsToLocalStorage();
  }
  
  const savedStats = localStorage.getItem('greenporo_stats');
  if (savedStats) {
    stats = JSON.parse(savedStats);
  }
  
  const savedTasks = localStorage.getItem('greenporo_tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  
  const savedActiveTaskId = localStorage.getItem('greenporo_active_task_id');
  if (savedActiveTaskId) {
    activeTaskId = savedActiveTaskId;
  }
  
  // Load daily history
  const savedHistory = localStorage.getItem('greenporo_daily_history');
  if (savedHistory) {
    dailyHistory = JSON.parse(savedHistory);
  } else {
    dailyHistory = {};
  }
  checkDailyReset();
  
  // Populate settings modal with current values
  settingPomodoro.value = settings.pomodoro;
  settingShortBreak.value = settings.shortBreak;
  settingLongBreak.value = settings.longBreak;
  settingInterval.value = settings.interval;
  settingAutoMusic.checked = settings.autoMusic;
  settingSoundAlert.checked = settings.soundAlert;
  
  musicEnabled = settings.autoMusic;
}

function saveSettingsToLocalStorage() {
  localStorage.setItem('greenporo_settings', JSON.stringify(settings));
}

function saveStatsToLocalStorage() {
  localStorage.setItem('greenporo_stats', JSON.stringify(stats));
}

function saveTasksToLocalStorage() {
  localStorage.setItem('greenporo_tasks', JSON.stringify(tasks));
  localStorage.setItem('greenporo_active_task_id', activeTaskId || '');
}

function saveDailyHistoryToLocalStorage() {
  localStorage.setItem('greenporo_daily_history', JSON.stringify(dailyHistory));
}

// -------------------------------------------------------------
// 2. Timer Control Logic
// -------------------------------------------------------------
function resetTimer(mode) {
  stopTimer();
  currentMode = mode;
  timeLeft = settings[mode] * 60;
  duration = timeLeft;
  
  // Update UI Tabs
  tabButtons.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  updateTimerDisplay();
  updateProgressBar();
  manageMusicPlayback();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');
  timerDisplay.textContent = `${minutesStr}:${secondsStr}`;
  
  // Also update browser tab title
  const modeLabel = currentMode === 'pomodoro' ? 'Focus' : 'Break';
  document.title = `[${minutesStr}:${secondsStr}] ${modeLabel} - GreenPoro 🌿`;
}

function updateProgressBar() {
  const percent = ((duration - timeLeft) / duration) * 100;
  progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}

function startTimer() {
  if (isPlaying) return;
  
  isPlaying = true;
  startBtn.textContent = 'PAUSE';
  startBtn.style.boxShadow = '0 2px 0 var(--dark-accent)';
  startBtn.style.transform = 'translateY(4px)';
  
  // Set target timestamp to avoid browser background throttle drifting
  endTime = Date.now() + timeLeft * 1000;
  
  timerInterval = setInterval(() => {
    const diff = endTime - Date.now();
    timeLeft = Math.max(0, Math.round(diff / 1000));
    
    updateTimerDisplay();
    updateProgressBar();
    
    if (timeLeft <= 0) {
      handleTimerCompletion();
    }
  }, 200);
  
  manageMusicPlayback();
}

function stopTimer() {
  if (!isPlaying) return;
  
  isPlaying = false;
  startBtn.textContent = 'START';
  startBtn.style.boxShadow = '0 6px 0 var(--dark-accent)';
  startBtn.style.transform = 'translateY(0)';
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  manageMusicPlayback();
}

function toggleTimer() {
  if (isPlaying) {
    stopTimer();
  } else {
    startTimer();
  }
}

function handleTimerCompletion() {
  playChimeNotification();
  
  let nextMode;
  if (currentMode === 'pomodoro') {
    // Increment Stats
    stats.cycles += 1;
    stats.focusTime += settings.pomodoro;
    
    // Save to dailyHistory
    const todayStr = getLocalDateString();
    dailyHistory[todayStr] = stats.cycles;
    saveDailyHistoryToLocalStorage();
    
    saveStatsToLocalStorage();
    updateStatsDisplay();
    renderContributionGraph();
    
    // Check next state: Short break or Long break?
    if (stats.cycles % settings.interval === 0) {
      nextMode = 'longBreak';
    } else {
      nextMode = 'shortBreak';
    }
  } else {
    // Break finished, go back to Pomodoro
    nextMode = 'pomodoro';
  }
  
  isTransitioningMode = true;

  // Auto switch to next mode
  resetTimer(nextMode);
  
  // Auto start next timer
  startTimer();

  isTransitioningMode = false;
  manageMusicPlayback();
}

function skipCycle() {
  // Jump directly to the next mode without confirmation prompt
  if (currentMode === 'pomodoro') {
    if ((stats.cycles + 1) % settings.interval === 0) {
      resetTimer('longBreak');
    } else {
      resetTimer('shortBreak');
    }
  } else {
    resetTimer('pomodoro');
  }
}

// -------------------------------------------------------------
// 3. Audio & Music Widget Management (Dual Mode: YouTube + Direct MP3)
// -------------------------------------------------------------
let currentLoadedAudioUrl = '';

function extractYoutubeId(url) {
  if (!url) return '';
  url = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

function isYoutubeUrl(url) {
  return extractYoutubeId(url) !== '';
}

function getModeLabel() {
  if (currentMode === 'pomodoro') return "focus";
  if (currentMode === 'shortBreak') return "short break";
  if (currentMode === 'longBreak') return "long break";
  return "timer";
}

function getMusicStatusText() {
  if (!musicEnabled) {
    return "Music disabled";
  }
  if (!isPlaying) {
    return `Auto-play when ${getModeLabel()} starts`;
  }
  return `Playing ${getModeLabel()} music`;
}

function updateAudioPlayback(forcePlay = false) {
  const url = (settings.ytLinks[currentMode] || '').trim();
  if (!url) {
    musicTitle.textContent = "No Music URL Loaded";
    updateMusicUI(false, "Paste a YouTube or MP3 link");
    return;
  }

  const shouldPlay = musicEnabled && (isPlaying || forcePlay);
  const isYt = isYoutubeUrl(url);

  if (isYt) {
    // Pause direct MP3 player if active
    if (audioPlayer) {
      audioPlayer.pause();
    }

    if (!ytPlayer || !ytPlayerReady) return;

    const videoId = extractYoutubeId(url);
    if (currentLoadedVideoId !== videoId || (isVideoCued && shouldPlay)) {
      currentLoadedVideoId = videoId;
      musicTitle.textContent = "Loading video...";
      if (shouldPlay) {
        isVideoCued = false;
        ytPlayer.loadVideoById(videoId);
      } else {
        isVideoCued = true;
        ytPlayer.cueVideoById(videoId);
      }
    } else {
      if (shouldPlay) {
        isVideoCued = false;
        ytPlayer.playVideo();
      } else {
        ytPlayer.pauseVideo();
      }
    }
  } else {
    // Pause YouTube player if active
    if (ytPlayer && ytPlayerReady) {
      ytPlayer.pauseVideo();
    }

    if (audioPlayer) {
      // Decode filename from direct URL
      let title = "Direct Audio Stream";
      try {
        const decoded = decodeURIComponent(url);
        const parts = decoded.split('/');
        const filename = parts[parts.length - 1];
        if (filename) {
          title = filename;
        }
      } catch (e) {}

      if (currentLoadedAudioUrl !== url) {
        currentLoadedAudioUrl = url;
        audioPlayer.src = url;
        musicTitle.textContent = title;
      }

      if (shouldPlay) {
        audioPlayer.play().then(() => {
          updateMusicUI(true, getMusicStatusText());
        }).catch(err => {
          console.warn("Audio playback blocked by browser:", err);
          updateMusicUI(false, "Playback blocked (click start to play)");
        });
      } else {
        audioPlayer.pause();
        updateMusicUI(false, getMusicStatusText());
      }
    }
  }
}

function manageMusicPlayback() {
  if (isTransitioningMode) return;

  if (youtubeLinkInput) {
    youtubeLinkInput.value = settings.ytLinks[currentMode] || '';
  }
  
  updateAudioPlayback();
}

// Ensure toggle action uses updateAudioPlayback
function toggleMusicOption() {
  musicEnabled = !musicEnabled;
  
  if (musicEnabled) {
    updateAudioPlayback(true); // force play for immediate preview
  } else {
    updateAudioPlayback(false);
  }
}

function handleYoutubeUrlChange() {
  const value = youtubeLinkInput.value.trim();
  settings.ytLinks[currentMode] = value;
  saveSettingsToLocalStorage();
  updateAudioPlayback(musicEnabled);
}

// YouTube Player Callbacks
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('youtube-player', {
    height: '1',
    width: '1',
    videoId: '', // loaded dynamically
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'disablekb': 1,
      'fs': 0,
      'modestbranding': 1,
      'rel': 0,
      'showinfo': 0,
      'autoplay': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
};

function onPlayerReady(event) {
  ytPlayerReady = true;
  manageMusicPlayback();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isVideoCued = false;
    const videoData = ytPlayer.getVideoData();
    const title = videoData && videoData.title ? videoData.title : "YouTube Video";
    musicTitle.textContent = title;
    updateMusicUI(true, getMusicStatusText());
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.CUED) {
    updateMusicUI(false, getMusicStatusText());
  } else if (event.data === YT.PlayerState.ENDED) {
    ytPlayer.playVideo(); // Loop track
  }
}

// Robust error handler
function onPlayerError(event) {
  console.warn("YouTube Player Error:", event.data);
  musicTitle.textContent = "Error loading YouTube video";
  updateMusicUI(false, "Invalid link or playback blocked");
}

function updateMusicUI(isCurrentlyPlaying, statusText) {
  musicStatus.textContent = statusText;
  
  if (isCurrentlyPlaying) {
    musicPlayIcon.classList.add('hidden');
    musicPauseIcon.classList.remove('hidden');
  } else {
    musicPlayIcon.classList.remove('hidden');
    musicPauseIcon.classList.add('hidden');
  }
}

function playChimeNotification() {
  if (!settings.soundAlert) return;
  
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Synthesize C-major arpeggio chime sound
    const playTone = (freq, startTime, duration) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    
    // Play a series of 3 chime arpeggios, total lasting ~5 seconds
    for (let i = 0; i < 3; i++) {
      const delay = i * 1.4;
      playTone(523.25, now + delay, 0.7);        // C5
      playTone(659.25, now + delay + 0.12, 0.9);  // E5
      playTone(783.99, now + delay + 0.24, 1.1);  // G5
      playTone(1046.50, now + delay + 0.36, 1.4); // C6
    }
  } catch (e) {
    console.error("Failed to generate chime sound:", e);
  }
}

// -------------------------------------------------------------
// 4. Statistics Management
// -------------------------------------------------------------
function updateStatsDisplay() {
  cyclesCompletedDisplay.textContent = stats.cycles;
  totalFocusTimeDisplay.textContent = `${stats.focusTime} mins`;
}

// -------------------------------------------------------------
// 5. Task List Management (Split & Collapsible Lists)
// -------------------------------------------------------------
function renderTasks() {
  taskList.innerHTML = '';
  
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    tasksCountDisplay.textContent = '0 tasks';
    activeTaskLabel.textContent = 'Focusing on: No task selected';
    return;
  }
  
  emptyState.classList.add('hidden');
  tasksCountDisplay.textContent = `${tasks.length} task${tasks.length > 1 ? 's' : ''}`;
  
  // Active task validation (if active task was deleted or completed, clear activeTaskId)
  const activeTaskExists = tasks.some(t => t.id === activeTaskId);
  if (!activeTaskExists && tasks.length > 0) {
    activeTaskId = null;
  }
  
  // Separate tasks into To-Do and Completed
  const todoTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  // --- 1. Render To-Do Section ---
  const todoHeader = document.createElement('div');
  todoHeader.className = `task-group-header ${!todoListOpen ? 'collapsed' : ''}`;
  todoHeader.innerHTML = `
    <span>To-Do (${todoTasks.length})</span>
    <svg class="caret-icon ${todoListOpen ? 'open' : ''}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  `;
  todoHeader.addEventListener('click', () => {
    todoListOpen = !todoListOpen;
    renderTasks();
  });
  taskList.appendChild(todoHeader);
  
  const todoContainer = document.createElement('div');
  todoContainer.className = `task-group-container ${!todoListOpen ? 'hidden' : ''}`;
  
  todoTasks.forEach(task => {
    const taskItem = createTaskDOMNode(task);
    todoContainer.appendChild(taskItem);
  });
  taskList.appendChild(todoContainer);
  
  // --- 2. Render Completed Section ---
  const completedHeader = document.createElement('div');
  completedHeader.className = `task-group-header ${!completedListOpen ? 'collapsed' : ''}`;
  completedHeader.innerHTML = `
    <span>Completed (${completedTasks.length})</span>
    <svg class="caret-icon ${completedListOpen ? 'open' : ''}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  `;
  completedHeader.addEventListener('click', () => {
    completedListOpen = !completedListOpen;
    renderTasks();
  });
  taskList.appendChild(completedHeader);
  
  const completedContainer = document.createElement('div');
  completedContainer.className = `task-group-container ${!completedListOpen ? 'hidden' : ''}`;
  
  completedTasks.forEach(task => {
    const taskItem = createTaskDOMNode(task);
    completedContainer.appendChild(taskItem);
  });
  taskList.appendChild(completedContainer);
  
  // Update header active task label
  updateActiveTaskLabel();
}

// Helper to create task DOM element with complete event attachments
function createTaskDOMNode(task) {
  const taskItem = document.createElement('div');
  taskItem.className = `task-item ${task.completed ? 'completed' : ''} ${task.id === activeTaskId ? 'active' : ''}`;
  taskItem.dataset.id = task.id;
  
  taskItem.innerHTML = `
    <label class="checkbox-container">
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span class="checkmark"></span>
    </label>
    <span class="task-title" contenteditable="false" spellcheck="false" title="Double-click to edit">${task.title}</span>
    <button class="delete-task-btn" title="Delete task">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;
  
  // Task toggle completion checkbox listener
  const checkbox = taskItem.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', (e) => {
    e.stopPropagation();
    toggleTaskCompleted(task.id);
  });
  
  // Prevent label clicks from triggering standard list item focus selection
  const label = taskItem.querySelector('.checkbox-container');
  label.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Delete task button listener
  const deleteBtn = taskItem.querySelector('.delete-task-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });
  
  // Select active focus task (only if not completed and not clicking delete/checkbox)
  taskItem.addEventListener('click', (e) => {
    if (e.target.closest('.checkbox-container') || e.target.closest('.delete-task-btn')) {
      return;
    }
    selectActiveTask(task.id);
  });
  
  // Inline editing title via double-click
  const titleSpan = taskItem.querySelector('.task-title');
  titleSpan.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    makeTaskEditable(titleSpan, task.id);
  });
  
  return taskItem;
}

function updateActiveTaskLabel() {
  if (activeTaskId) {
    const activeTask = tasks.find(t => t.id === activeTaskId);
    if (activeTask && !activeTask.completed) {
      activeTaskLabel.textContent = `Focusing on: ${activeTask.title}`;
      return;
    }
  }
  
  // Fallback to first uncompleted task
  const firstUncompleted = tasks.find(t => !t.completed);
  if (firstUncompleted) {
    activeTaskId = firstUncompleted.id;
    activeTaskLabel.textContent = `Focusing on: ${firstUncompleted.title}`;
  } else {
    activeTaskId = null;
    activeTaskLabel.textContent = 'Focusing on: No task selected';
  }
}

function handleAddTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  
  const newTask = {
    id: Date.now().toString(),
    title: text,
    completed: false
  };
  
  tasks.push(newTask);
  
  // Set as active focus task if it's the only one or if nothing is active
  if (tasks.length === 1 || !activeTaskId) {
    activeTaskId = newTask.id;
  }
  
  taskInput.value = '';
  saveTasksToLocalStorage();
  renderTasks();
}

function toggleTaskCompleted(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      const isNowCompleted = !task.completed;
      // If task is completed and was the active task, clear active state
      if (isNowCompleted && activeTaskId === id) {
        activeTaskId = null;
      }
      return { ...task, completed: isNowCompleted };
    }
    return task;
  });
  
  saveTasksToLocalStorage();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  if (activeTaskId === id) {
    activeTaskId = null;
  }
  saveTasksToLocalStorage();
  renderTasks();
}

function selectActiveTask(id) {
  const clickedTask = tasks.find(t => t.id === id);
  if (clickedTask && !clickedTask.completed) {
    activeTaskId = id;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

function makeTaskEditable(span, id) {
  span.contentEditable = "true";
  span.focus();
  
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(span);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
  
  const handleSave = () => {
    span.contentEditable = "false";
    const newTitle = span.textContent.trim();
    
    if (newTitle) {
      tasks = tasks.map(task => {
        if (task.id === id) {
          return { ...task, title: newTitle };
        }
        return task;
      });
      saveTasksToLocalStorage();
    }
    renderTasks();
  };
  
  span.addEventListener('blur', handleSave, { once: true });
  
  span.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      span.blur(); 
    }
    if (e.key === 'Escape') {
      span.textContent = tasks.find(t => t.id === id).title;
      span.contentEditable = "false";
      renderTasks();
    }
  });
}

// -------------------------------------------------------------
// 6. Settings & Modal Handling
// -------------------------------------------------------------
function openSettingsModal() {
  settingPomodoro.value = settings.pomodoro;
  settingShortBreak.value = settings.shortBreak;
  settingLongBreak.value = settings.longBreak;
  settingInterval.value = settings.interval;
  settingAutoMusic.checked = settings.autoMusic;
  settingSoundAlert.checked = settings.soundAlert;
  
  // Set YouTube input values
  document.getElementById('setting-yt-pomodoro').value = settings.ytLinks.pomodoro || '';
  document.getElementById('setting-yt-short-break').value = settings.ytLinks.shortBreak || '';
  document.getElementById('setting-yt-long-break').value = settings.ytLinks.longBreak || '';
  
  settingsModal.classList.remove('hidden');
}

function closeSettingsModal() {
  settingsModal.classList.add('hidden');
}

function handleSaveSettings() {
  const pMin = Math.max(1, parseInt(settingPomodoro.value) || 25);
  const sMin = Math.max(1, parseInt(settingShortBreak.value) || 5);
  const lMin = Math.max(1, parseInt(settingLongBreak.value) || 15);
  const interval = Math.max(1, parseInt(settingInterval.value) || 4);
  const autoMusic = settingAutoMusic.checked;
  const soundAlert = settingSoundAlert.checked;
  
  // Get YouTube links
  const ytPomodoro = document.getElementById('setting-yt-pomodoro').value.trim();
  const ytShortBreak = document.getElementById('setting-yt-short-break').value.trim();
  const ytLongBreak = document.getElementById('setting-yt-long-break').value.trim();
  
  settings = {
    pomodoro: pMin,
    shortBreak: sMin,
    longBreak: lMin,
    interval: interval,
    autoMusic: autoMusic,
    soundAlert: soundAlert,
    ytLinks: {
      pomodoro: ytPomodoro,
      shortBreak: ytShortBreak,
      longBreak: ytLongBreak
    }
  };
  
  saveSettingsToLocalStorage();
  closeSettingsModal();
  
  // Recalculate focus time based on new setting
  stats.focusTime = stats.cycles * settings.pomodoro;
  saveStatsToLocalStorage();
  updateStatsDisplay();
  
  musicEnabled = autoMusic;
  manageMusicPlayback();
}

// -------------------------------------------------------------
// 7. Core Event Listeners
// -------------------------------------------------------------
function setupEventListeners() {
  // Timer buttons
  startBtn.addEventListener('click', toggleTimer);
  skipBtn.addEventListener('click', skipCycle);
  
  // Tab buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode !== currentMode) {
        resetTimer(mode);
      }
    });
  });
  
  // Music selector & controls
  youtubeLinkInput.addEventListener('change', handleYoutubeUrlChange);
  youtubeLinkInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      youtubeLinkInput.blur();
    }
  });
  
  musicToggleBtn.addEventListener('click', toggleMusicOption);
  
  // Task manager actions
  addTaskForm.addEventListener('submit', handleAddTask);
  
  // Settings modal opening/closing
  settingsBtn.addEventListener('click', openSettingsModal);
  modalCloseBtn.addEventListener('click', closeSettingsModal);
  settingsCancelBtn.addEventListener('click', closeSettingsModal);
  settingsSaveBtn.addEventListener('click', handleSaveSettings);
  
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      closeSettingsModal();
    }
  });
}

// Start Application on Load
window.addEventListener('DOMContentLoaded', init);

// -------------------------------------------------------------
// 8. Daily Reset & Contribution Graph Generator
// -------------------------------------------------------------
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function checkDailyReset() {
  const todayStr = getLocalDateString();
  const todayCycles = dailyHistory[todayStr] || 0;
  
  stats.cycles = todayCycles;
  stats.focusTime = todayCycles * settings.pomodoro;
  saveStatsToLocalStorage();
  updateStatsDisplay();
}

function calculateStreak(history) {
  let streak = 0;
  let checkDate = new Date();
  
  // Check if today has at least 1 pomo
  const todayStr = getLocalDateString(checkDate);
  if (history[todayStr] && history[todayStr] > 0) {
    streak = 1;
    // Go backwards from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
      const dateStr = getLocalDateString(checkDate);
      if (history[dateStr] && history[dateStr] > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  } else {
    // If today is 0, check if yesterday was active to continue the streak
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = getLocalDateString(checkDate);
    if (history[yesterdayStr] && history[yesterdayStr] > 0) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const dateStr = getLocalDateString(checkDate);
        if (history[dateStr] && history[dateStr] > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }
  return streak;
}

function renderContributionGraph() {
  const gridContainer = document.getElementById('calendar-grid');
  const monthLabelsContainer = document.getElementById('month-labels');
  
  if (!gridContainer || !monthLabelsContainer) return;
  
  gridContainer.innerHTML = '';
  monthLabelsContainer.innerHTML = '';
  
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  
  // Find current Sunday
  const currentSunday = new Date(today);
  currentSunday.setDate(today.getDate() - currentDayOfWeek);
  
  // Find Sunday 52 weeks ago
  const startDate = new Date(currentSunday);
  startDate.setDate(currentSunday.getDate() - 52 * 7);
  
  // Generate 371 days
  const days = [];
  const dateCursor = new Date(startDate);
  for (let i = 0; i < 371; i++) {
    days.push(new Date(dateCursor));
    dateCursor.setDate(dateCursor.getDate() + 1);
  }
  
  // Generate Month Labels (53 columns)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let lastMonthName = "";
  
  for (let col = 0; col < 53; col++) {
    const firstDayOfWeek = days[col * 7];
    const monthName = monthNames[firstDayOfWeek.getMonth()];
    
    const labelSpan = document.createElement('span');
    if (monthName !== lastMonthName) {
      labelSpan.textContent = monthName;
      lastMonthName = monthName;
    }
    monthLabelsContainer.appendChild(labelSpan);
  }
  
  // Generate Grid Cells
  const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  
  days.forEach(date => {
    const dateStr = getLocalDateString(date);
    const cellTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const count = dailyHistory[dateStr] || 0;
    
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    
    if (cellTime > todayTime) {
      cell.classList.add('future');
    } else {
      let level = 0;
      if (count > 0) {
        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count === 3) level = 3;
        else level = 4;
      }
      cell.classList.add(`level-${level}`);
      
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const pomoWord = count === 1 ? 'pomodoro' : 'pomodoros';
      cell.setAttribute('data-tooltip', `${count} ${pomoWord} on ${formattedDate}`);
    }
    
    gridContainer.appendChild(cell);
  });
  
  updateSidebarStats();
}

function updateSidebarStats() {
  const totalPomoCountDisplay = document.getElementById('total-pomo-count');
  const currentStreakDisplay = document.getElementById('current-streak');
  const activeDaysCountDisplay = document.getElementById('active-days-count');
  
  if (!totalPomoCountDisplay || !currentStreakDisplay || !activeDaysCountDisplay) return;
  
  let totalPomo = 0;
  let activeDays = 0;
  
  Object.values(dailyHistory).forEach(count => {
    if (count > 0) {
      totalPomo += count;
      activeDays += 1;
    }
  });
  
  const streak = calculateStreak(dailyHistory);
  
  totalPomoCountDisplay.textContent = totalPomo;
  currentStreakDisplay.textContent = streak;
  activeDaysCountDisplay.textContent = activeDays;
}

// Window focus daily sync check
window.addEventListener('focus', () => {
  checkDailyReset();
  renderContributionGraph();
});
