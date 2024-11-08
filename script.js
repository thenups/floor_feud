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
    "answers": ["Andrei", "Fabio", "Sam", "Sharran", "Tamir"],
    "points": [42, 27, 11, 10, 9, 1]
  },
  {
    "question": "What is the most exciting upcoming feature? ",
    "answers": ["Mufasa", "Wallet", "More SOX Projects", "Referral Central", "Anything to do with Leo"],
    "points": [44, 23, 12, 11, 10]
  }];

let answers = document.querySelectorAll(".answer");

//function to start timer:
function countdown() {
  var seconds = 59;
  function tick() {
    var counter = document.getElementById("counter");
    seconds--;
    counter.innerHTML =
      "Time left: <br> 0:" + (seconds < 10 ? "0" : "") + String(seconds);
    if (seconds > 0) {
      setTimeout(tick, 1000);
    } else {
      document.getElementById("counter").innerHTML = "";
    }
  }
  tick();
}

let currentQuestionID = 0;

//FIELD INPUT COMPARISON AND SCORE CODE

const inputField = document.querySelector("#guess");

function checkAnswer(guess) {
  for (let i = 0; i < questionBank[currentQuestionID].answers.length; i++) {
    if (guess === questionBank[currentQuestionID].answers[i].toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')) {
      roundPoints += questionBank[currentQuestionID].points[i];
      answers.forEach((answer) => {
        let answerNum = parseInt(answer.id);
        if (answerNum === i) {
          answer.classList.remove("hidden");
          answer.innerHTML = questionBank[currentQuestionID].answers[i] + `<br> ${questionBank[currentQuestionID].points[i]} points`;
        }
      })
      return true;
    }
  }
  return false;
}

var confettiShower = [];
var numConfettis = 400;
var container = document.getElementById('confetti-container');
var colors = [
  "#00FF73  ",
  "#6C4AE2",
  "#FDDA00 ",
  "#DB27DB ",
  "#FA405A ",
  "#51EFFC ",
  "#EB640A "
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
  } else {
    playWrongAnswerSound();
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
  // Reset answers display
  answers.forEach(answer => {
    answer.classList.add("hidden");
    answer.innerHTML = "";
  });
  // Reset round state
  roundPoints = 0;
}

newQuestionButton.addEventListener("click", () => {
  console.log("new question button clicked");
  currentQuestionID = (currentQuestionID + 1) % questionBank.length;  // Cycle through questions
  displayQuestion(currentQuestionID);
  playNextQuestionSound();
});
