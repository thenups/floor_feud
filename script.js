


console.log("script running");
//Variables:
let team1ScoreBox = document.querySelector(".team1");
let team2ScoreBox = document.querySelector(".team2");
let roundScoreBox = document.querySelector(".roundScore");
let guessesBox = document.querySelector(".guessesLeft");
let questionBox = document.querySelector(".questionBox");
let newQuestionButton = document.querySelector(".questionButton");
let submitButton = document.querySelector("#submitButton");
let endGameButton=document.querySelector(".endGame");

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

let team1Points = 0;
let team2Points = 0;
let roundPoints = 0;
let guessesLeft = 1;

function updateBoard() {
  team1ScoreBox.innerHTML = `Attic VPs: ${team1Points}`;
  team2ScoreBox.innerHTML = `Basement VPs: ${team2Points}`;
  roundScoreBox.innerHTML = `Round Score: ${roundPoints}`;
  guessesBox.innerHTML = `Guesses Left: ${guessesLeft}`;
}

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



//GETTING A RANDOM QUESTION CODE
let randomNum = 0;
newQuestionButton.addEventListener("click", () => {
  randomNum = Math.floor(Math.random() * 2);
  questionBox.innerHTML = questionBank[randomNum].question;
  incorrectAnswerResponse.classList.add("hidden");
  countdown();
  roundPoints  = 0;
  guessesLeft = 3;
  //add hidden to classlist of all answers
  answers.forEach((answer) => {
    answer.classList.add("hidden");
  })
  updateBoard();
});

//FIELD INPUT COMPARISON AND SCORE CODE

const inputField = document.querySelector("#guess");
let incorrectAnswerResponse = document.querySelector("#incorrectAnswerResponse");

function checkAnswer(guess){
    for (let i = 0; i < questionBank[randomNum].answers.length; i++) {
      //correct answer
      if (guess === questionBank[randomNum].answers[i].toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')) {
        roundPoints += questionBank[randomNum].points[i];
        answers.forEach((answer)=> {
          let answerNum = parseInt(answer.id);
          if(answerNum === i){
            answer.classList.remove("hidden");
            answer.innerHTML = questionBank[randomNum].answers[i] + `<br> ${questionBank[randomNum].points[i]} points`; 
          }
        })
        return true;
      }
    }
      guessesLeft--;
      updateBoard();
      return false;
}

let flag;
// submitButton.addEventListener("click", );



//SCORE UPDATE CODE
team1ScoreBox.addEventListener("click", () => {
  team1Points += roundPoints; 
  updateBoard();
});
 



team2ScoreBox.addEventListener("click", () => {
  team2Points += roundPoints;
  updateBoard();
});


//AUDIO 
function submit () {
const audio= new Audio (); 
audio.src = "sound.mp3"; 
audio.play();
}

function team () {
  const audio = new Audio(); 
  audio.src = "new.mp3"; 
  audio.play(); 
}

function points () {
  const audio = new Audio(); 
  audio.src ="points.mp3";
  audio.play(); 
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
    this.h = this.w*1.2;
    this.x = Math.floor(Math.random() * 100);
    this.y = Math.floor(Math.random() * 100);
    this.c = colors[Math.floor(Math.random() * colors.length)];
  }
  create() {
      var newConfetti = '<div class="confetti" style="bottom:' + this.y +'%; left:' + this.x +'%;width:' +
        this.w +'px; height:' + this.h +'px;"><div class="rotate"><div class="askew" style="background-color:' + this.c + '"></div></div></div>';
      container.innerHTML+= newConfetti; 
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

endGameButton.addEventListener("click", ()=> {
  animateConfetti();
  if(team1Points > team2Points){
    alert("Team 1 won!");
  }
  else if(team1Points < team2Points){
    alert("Team 2 won!")
  }
  else if(team1Points === team2Points) {
    alert("The game is tied!"); 
  }
});

let submitAnswer = (event) => {
  console.log("submitted");
  let guess = inputField.value.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

  if (guessesLeft > 0){
    flag = checkAnswer(guess);
   
  }

  if(flag === true){
    incorrectAnswerResponse.classList.add("hidden");
  }
 
  if(flag === false){
    incorrectAnswerResponse.classList.remove("hidden");
  }
  
   if(guessesLeft === 0){
    alert("You have ran out of guesses. Click which team you would like to add points to"); 
  }
  updateBoard();
  inputField.value = "";
};

document.getElementById("answerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  let guess = inputField.value.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  submitAnswer(event)
  team();
});



