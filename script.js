console.log("script running");
//Variables:
let team1ScoreBox = document.querySelector(".team1");
let team2ScoreBox = document.querySelector(".team2");
let roundScoreBox = document.querySelector(".roundScore");
let questionBox = document.querySelector(".questionBox");
let newQuestionButton = document.querySelector("#nextQuestion");
let submitButton = document.querySelector("#submitButton");
let endGameButton = document.querySelector(".endGame");

let questionBank = [
  {
    "question": "Who really responds to all of the Leo questions?",
    "answers": ["Andrei Vazhnov", "Fabio Brahimi", "Sam Ryan", "Sharran Srivatsaa", "Tamir Poleg"],
    "points": [42, 27, 11, 10, 9, 1]
  },
  {
    "question": "What is the most exciting upcoming feature? ",
    "answers": ["Mufasa", "Wallet", "More SOX Projects!!", "Referral Central", "Anything to do with Leo"],
    "points": [44, 23, 12, 11, 10]
  }];

let answers = document.querySelectorAll(".answer");

// Add at the top with other variables
let activeTeam = 1; // 1 for team1, 2 for team2
let team1Score = 0;
let team2Score = 0;
let roundPoints = 0;
let team1WrongAnswer = false;
let team2WrongAnswer = false;
let timerInterval; // To store the timer reference

// Add these variables at the top with other variables
let isTimerRunning = false;
let savedSeconds = 20; // To store the remaining time when paused

// Add this line after other variable declarations
let guessInput = document.getElementById('guess');
guessInput.disabled = true;  // Disable input field initially
guessInput.placeholder = 'Click Next Question to start!';

// Add at the top with other variables
let isTeam1Starting = true;  // New variable to track which team starts

//function to start timer:
function countdown() {
  clearInterval(timerInterval);
  let seconds = savedSeconds;
  
  function tick() {
    var counter = document.getElementById("counter");
    counter.innerHTML = `
      <span style="font-family: 'Telegraf', 'Poppins', sans-serif; color: #050E3D;">
        Time left: <br> ${(seconds < 10 ? "0" : "") + String(seconds)}
      </span>
    `;
    
    if (seconds <= 0) {
      clearInterval(timerInterval);
      playWrongAnswerSound();
      if (activeTeam === 1) {
        team1WrongAnswer = true;
      } else {
        team2WrongAnswer = true;
      }

      if (team1WrongAnswer && team2WrongAnswer) {
        deselectBothTeams();
        showModal();
      } else {
        activeTeam = activeTeam === 1 ? 2 : 1;
        updateActiveTeamDisplay();
        savedSeconds = 20;
        isTimerRunning = false;
        const playPauseButton = document.querySelector('.btnGroup button');
        playPauseButton.textContent = "▶️";
        countdown();
      }
      return;
    }
    seconds--;
    savedSeconds = seconds;
  }
  
  if (isTimerRunning) {
    tick();
    timerInterval = setInterval(tick, 1000);
  } else {
    var counter = document.getElementById("counter");
    counter.innerHTML = `
      <span style="font-family: 'Telegraf', 'Poppins', sans-serif; color: #050E3D;">
        Time left: <br> ${(seconds < 10 ? "0" : "") + String(seconds)}
      </span>
    `;
  }
}

// Add new function to handle play/pause
function playPause() {
  isTimerRunning = !isTimerRunning;
  const playPauseButton = document.querySelector('.btnGroup button');
  
  if (isTimerRunning) {
    playPauseButton.textContent = "⏸";
    countdown();
  } else {
    playPauseButton.textContent = "▶️";
    clearInterval(timerInterval);
  }
}

// start with -1 so that when we click next question, it will be 0
let currentQuestionID = -1;

//FIELD INPUT COMPARISON AND SCORE CODE

const inputField = document.querySelector("#guess");

function checkAnswer(guess) {
  const answerVariants = {
    // Question 1 variants
    "andrei vazhnov": ["andrei"],
    "fabio brahimi": ["fabio"],
    "sam ryan": ["sam"],
    "sharran srivatsaa": ["sharran"],
    "tamir poleg": ["tamir"],
    
    // Question 2 variants
    "mufasa": ["mufasa"],
    "wallet": ["wallet"],
    "more sox projects!!": ["sox", "more sox", "more sox projects"],
    "referral central": ["referral", "referrals", "referral central"],
    "anything to do with leo": ["leo", "anything leo", "anything to do with leo"]
  };

  for (let i = 0; i < questionBank[currentQuestionID].answers.length; i++) {
    const originalAnswer = questionBank[currentQuestionID].answers[i].toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    const variants = answerVariants[originalAnswer] || [originalAnswer];
    
    if (variants.includes(guess)) {
      roundPoints = questionBank[currentQuestionID].points[i];
      answers.forEach((answer) => {
        let answerNum = parseInt(answer.id);
        if (answerNum === i) {
          answer.classList.remove("hidden");
        }
      });
      return true;
    }
  }
  return false;
}

var confettiShower = [];
var numConfettis = 400;
var container = document.getElementById('confetti-container');
var colors = [
  "#050E3D", // Cobalt
  "#BFDDDB", // Seaglass
  "#615B56", // Slate
  "#05C3F9", // Legacy Blue
  "#00FBF0", // Aqua
  "#FF557E", // Coral
  "#FFFFFF"  // Chalk
];

class Confetti {
  constructor(x, y, w, h, c) {
    this.w = Math.floor(Math.random() * 15 + 5);
    this.h = this.w * 1.2;
    this.x = Math.floor(Math.random() * 100);
    this.y = Math.floor(Math.random() * 100);
    this.c = colors[Math.floor(Math.random() * colors.length)];
  }
  create() {
    var newConfetti = '<div class="confetti" style="bottom:' + this.y + '%; left:' + this.x + '%;width:' +
      this.w + 'px; height:' + this.h + 'px;"><div class="rotate"><div class="askew" style="background-color:' + this.c + '"></div></div></div>';
    container.innerHTML += newConfetti;
  }
};

function animateConfetti() {
  for (var i = 1; i <= numConfettis; i++) {
    var confetti = new Confetti();
    confetti.create();
  }
  var confettis = document.querySelectorAll('.confetti');
  for (var i = 0; i < confettis.length; i++) {
    var opacity = Math.random() + 0.1;
    var animated = confettis[i].animate([
      { transform: 'translate3d(0,0,0)', opacity: opacity },
      { transform: 'translate3d(20vw,100vh,0)', opacity: 1 }
    ], {
      duration: Math.random() * 3000 + 3000,
      iterations: Infinity,
      delay: -(Math.random() * 5000)
    });
    confettiShower.push(animated);
  }
}

let submitAnswer = (event) => {
  console.log("submitted");
  let guess = inputField.value.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

  if (checkAnswer(guess)) {
    playCorrectAnswerSound();
    if (activeTeam === 1) {
      team1Score += roundPoints;
      document.querySelector('.team1-score').textContent = team1Score;
    } else {
      team2Score += roundPoints;
      document.querySelector('.team2-score').textContent = team2Score;
    }

    if (areAllAnswersRevealed()) {
      clearInterval(timerInterval);
      deselectBothTeams();
      showModal();
    } else {
      savedSeconds = 20;
      countdown();
    }
  } else {
    playWrongAnswerSound();
    if (activeTeam === 1) {
      team1WrongAnswer = true;
    } else {
      team2WrongAnswer = true;
    }

    if (team1WrongAnswer && team2WrongAnswer) {
      clearInterval(timerInterval);
      deselectBothTeams();
      showModal();
    }

    activeTeam = activeTeam === 1 ? 2 : 1;
    updateActiveTeamDisplay();
    savedSeconds = 20;
    isTimerRunning = false;
    const playPauseButton = document.querySelector('.btnGroup button');
    playPauseButton.textContent = "⏯️";
    countdown();
  }

  inputField.value = "";
};

document.getElementById("answerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  let guess = inputField.value.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  submitAnswer(event)
});

//AUDIO 
function playCorrectAnswerSound() {
  const audio = new Audio();
  audio.src = "sounds/sound.mp3";
  audio.play();
}

function playWrongAnswerSound() {
  const audio = new Audio();
  audio.src = "sounds/wompwomp.mp3";
  audio.play();
}

function playNextQuestionSound() {
  const audio = new Audio();
  audio.src = "sounds/points.mp3";
  audio.play();
}

function displayQuestion(questionId) {
  questionBox.innerHTML = questionBank[questionId].question;
  answers.forEach((answer, i) => {
    answer.classList.add("hidden");
    if (i < questionBank[currentQuestionID].answers.length) {
      answer.innerHTML = questionBank[currentQuestionID].answers[i] + `<br> ${questionBank[currentQuestionID].points[i]} points`;
    } else {
      answer.innerHTML = "";
    }
    answer.closest('.board-item-content').classList.remove('unguessed-answer');
  });
  
  roundPoints = 0;
  // Set starting team based on isTeam1Starting
  activeTeam = isTeam1Starting ? 1 : 2;
  team1WrongAnswer = false;
  team2WrongAnswer = false;
  updateActiveTeamDisplay();
  guessInput.disabled = false;
  guessInput.placeholder = 'Type your guess here!';
  
  // Toggle starting team for next round
  isTeam1Starting = !isTeam1Starting;
}

newQuestionButton.addEventListener("click", () => {
  currentQuestionID++;
  console.log("new question button clicked", currentQuestionID, questionBank.length);
  
  if (currentQuestionID < questionBank.length) {
    displayQuestion(currentQuestionID);
    playNextQuestionSound();
    savedSeconds = 20; // Reset saved seconds
    isTimerRunning = false; // Ensure timer starts paused
    const playPauseButton = document.querySelector('.btnGroup button');
    playPauseButton.textContent = "⏯️";
    countdown(); // This will just display the time without starting
  } else {
    endGame();
  }
});

// Add new function to update active team display
function updateActiveTeamDisplay() {
  const team1Section = document.querySelector('#team1Section');
  const team2Section = document.querySelector('#team2Section');
  const team1Name = document.querySelector('#atticVPs');
  const team2Name = document.querySelector('#basementVPs');

  if (activeTeam === 1) {
    team1Section.classList.add('active-team');
    team2Section.classList.remove('active-team');
    team1Name.classList.add('active-team');
    team2Name.classList.remove('active-team');
  } else {
    team2Section.classList.add('active-team');
    team1Section.classList.remove('active-team');
    team2Name.classList.add('active-team');
    team1Name.classList.remove('active-team');
  }
}

function showModal() {
  document.querySelector('.modal-background').style.display = 'flex';
  
  if (!document.querySelector('.modal-content').classList.contains('game-end')) {
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
      <span class="modal-close">&times;</span>
      <h2 style="font-family: 'Telegraf', 'Poppins', sans-serif;">Round Over!</h2>
      <button class="button is-primary" id="modalOkButton">OK</button>
    `;
    
    document.getElementById('modalOkButton').addEventListener('click', closeModal);
  }
}

function closeModal() {
  clearInterval(timerInterval);
  document.querySelector('.modal-background').style.display = 'none';
  document.querySelector('.modal-content').classList.remove('game-end');
  revealUnguessedAnswers();
  disableAnswerForm();
  deselectBothTeams();
}

function revealUnguessedAnswers() {
  const answers = document.querySelectorAll('.answer');
  answers.forEach(answer => {
    if (answer.classList.contains('hidden')) {
      answer.classList.remove('hidden');
      answer.closest('.board-item-content').classList.add('unguessed-answer');
    }
  });
}

function disableAnswerForm() {
  const guessInput = document.getElementById('guess');
  guessInput.disabled = true;
  guessInput.placeholder = 'Round is over';
}

document.querySelector('.modal-close').addEventListener('click', closeModal);

function areAllAnswersRevealed() {
  const hiddenAnswers = document.querySelectorAll('.answer.hidden');
  return hiddenAnswers.length === 0;
}

// Add new function to handle game end
function endGame() {
  const isTeam1Winner = team1Score > team2Score;
  const isTie = team1Score === team2Score;
  
  const modalContent = document.querySelector('.modal-content');
  modalContent.classList.add('game-end');
  
  modalContent.innerHTML = `
    <span class="modal-close">&times;</span>
    <h2 class="title is-2" style="font-family: 'Telegraf', 'Poppins', sans-serif; color: #050E3D;">Game Over!</h2>
    ${isTie ? `
      <h3 class="subtitle is-3" style="font-family: 'Telegraf', 'Poppins', sans-serif; color: #050E3D;">It's a Tie!</h3>
      <div class="columns is-centered">
        <div class="column is-half">
          <div class="team-result">
            <h4 style="font-family: 'Telegraf', 'Poppins', sans-serif;">Attic VPs & Basement VPs</h4>
            <p class="final-score" style="font-family: 'Inter', 'Arial', sans-serif; color: #050E3D;">${team1Score} points</p>
          </div>
        </div>
      </div>
    ` : `
      <h3 class="subtitle is-3" style="font-family: 'Telegraf', 'Poppins', sans-serif; color: #050E3D;">
        ${isTeam1Winner ? 'Attic VPs' : 'Basement VPs'} Wins!
      </h3>
      <div class="winning-team">
        <div class="avatar-container">
          <div class="team-avatar" style="border-color: #05C3F9;">
            <img src="https://ca.slack-edge.com/T041X66AJ-${isTeam1Winner ? 'U06CQ3K63QR-1882d0f16642' : 'U01HN4982KD-c60dbacf8c8d'}-512" alt="Winner 1" class="team-image">
          </div>
          <div class="team-avatar" style="border-color: #05C3F9;">
            <img src="https://ca.slack-edge.com/T041X66AJ-${isTeam1Winner ? 'U07DV4RK3BP-33a9e8caf1e8' : 'U01PP23N42F-33c796cb2888'}-512" alt="Winner 2" class="team-image">
          </div>
        </div>
        <p class="winner-score" style="font-family: 'Inter', 'Arial', sans-serif; color: #050E3D;">
          ${isTeam1Winner ? team1Score : team2Score} points
        </p>
      </div>
      <div class="losing-team">
        <p class="loser-label" style="font-family: 'Telegraf', 'Poppins', sans-serif; color: #615B56;">Runner Up:</p>
        <p class="loser-name" style="font-family: 'Telegraf', 'Poppins', sans-serif; color: #615B56;">
          ${isTeam1Winner ? 'Basement VPs' : 'Attic VPs'}
        </p>
        <p class="loser-score" style="font-family: 'Inter', 'Arial', sans-serif; color: #615B56;">
          ${isTeam1Winner ? team2Score : team1Score} points
        </p>
      </div>
    `}
  `;
  
  showModal();
  animateConfetti();
  
  // Add event listener for the close button
  const closeButton = modalContent.querySelector('.modal-close');
  closeButton.addEventListener('click', closeModal);
  
  // Disable game controls
  newQuestionButton.disabled = true;
  guessInput.disabled = true;
  guessInput.placeholder = 'Game Over!';
}

// Add this function to remove active styling from both teams
function deselectBothTeams() {
  const team1Section = document.querySelector('#team1Section');
  const team2Section = document.querySelector('#team2Section');
  const team1Name = document.querySelector('#atticVPs');
  const team2Name = document.querySelector('#basementVPs');

  team1Section.classList.remove('active-team');
  team2Section.classList.remove('active-team');
  team1Name.classList.remove('active-team');
  team2Name.classList.remove('active-team');
}