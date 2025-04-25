const startButton = document.getElementById("start");
const gameMethod = document.getElementById("method");
const gamePlay = document.getElementById("gamePlay");
const timer = document.getElementById("timer");
const score = document.getElementById("score");
const background = document.getElementById("background");

const question = document.createElement("div");
const answers = document.createElement("div");

const gameData = {
  method: gameMethod.textContent,
  correct: true,
  time: 30,
  score: 0,
  starting: true,
};

let start = false;

let timerInterval;

function startGame() {
  startButton.style.display = "none";
  console.log("getting content");

  fetch("http://localhost:3000/game/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network connection lost");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const correctAnswer = data.answer;
      const answer = data.answer;

      sendAnswer(correctAnswer, answer);
    })
    .catch((error) => {
      return console.error("Fetch error:", error);
    });
}

// Main game loop
function sendAnswer(correctAnswer, answer) {
  if (correctAnswer === answer) {
    gameData.correct = true;
    if (start) {
      timer.style.color = "rgb(50, 143, 33)";

      resetTimerColor();
    }

    start = true;
  } else {
    gameData.correct = false;
    timer.style.color = "rgb(154, 21, 21)";

    resetTimerColor();
  }

  fetch("http://localhost:3000/game/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network connection lost");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      gameData.score = data.score;
      score.textContent = `Score: ${gameData.score}`;

      gameData.time = data.time;
      timer.textContent = `Time: ${gameData.time}`;

      let operator = "";
      const method = data.method;
      switch (method) {
        case "Addition":
          operator = "+";
          break;
        case "Subtraction":
          operator = "-";
          break;
        case "Multiplication":
          operator = "x";
          break;
        case "Division":
          operator = "/";
          break;
      }

      const pos = Math.random();
      let quest_1 = 0;
      let quest_2 = 0;
      let quest_3 = 0;
      let quest_4 = 0;

      if (pos <= 0.25) {
        quest_1 = data.answer;
        quest_2 = data.wrongAnswers[0];
        quest_3 = data.wrongAnswers[1];
        quest_4 = data.wrongAnswers[2];
      } else if (pos > 0.25 && pos <= 0.5) {
        quest_1 = data.wrongAnswers[0];
        quest_2 = data.answer;
        quest_3 = data.wrongAnswers[1];
        quest_4 = data.wrongAnswers[2];
      } else if (pos > 0.5 && pos <= 0.75) {
        quest_1 = data.wrongAnswers[0];
        quest_2 = data.wrongAnswers[1];
        quest_3 = data.answer;
        quest_4 = data.wrongAnswers[2];
      } else {
        quest_1 = data.wrongAnswers[0];
        quest_2 = data.wrongAnswers[1];
        quest_3 = data.wrongAnswers[2];
        quest_4 = data.answer;
      }

      answers.className = "answers";
      question.innerHTML = `<h3>${data.num_1} ${operator} ${data.num_2}</h3>`;
      answers.innerHTML = `<button onclick="sendAnswer(${data.answer}, ${quest_1})">${quest_1}</button>
      <button onclick="sendAnswer(${data.answer}, ${quest_2})>${quest_2}">${quest_2}</button>
      <button onclick="sendAnswer(${data.answer}, ${quest_3})>${quest_3}">${quest_3}</button>
      <button onclick="sendAnswer(${data.answer}, ${quest_4})>${quest_4}">${quest_4}</button>`;

      gamePlay.appendChild(question);
      gamePlay.appendChild(answers);

      if (!timerInterval) {
        startTimer();
      }
    })
    .catch((error) => {
      return console.error("Fetch error:", error);
    });

  gameData.starting = false;
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (gameData.time > 1) {
      gameData.time--;
      timer.textContent = `Time: ${gameData.time}`;
    } else {
      // GAME OVER
      clearInterval(timerInterval);

      score.textContent = "";
      timer.textContent = "";
      question.innerHTML = "";
      answers.innerHTML = "";

      gamePlay.appendChild(question);
      gamePlay.appendChild(answers);

      const gameScore = {
        gameType: gameData.method,
        score: gameData.score,
      };

      fetch("http://localhost:3000/game/high/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameScore),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network connection lost");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);

          if (data.newHighScore) {
            gamePlay.innerHTML = `<h1>Game Over</h1><h2>Score: ${gameData.score}</h2><h4>New High Score: ${data.highScore}</h4>`;
          } else {
            gamePlay.innerHTML = `<h1>Game Over</h1><h2>Score: ${gameData.score}</h2><h4>High Score: ${data.highScore}</h4>`;
          }

          gamePlay.innerHTML += `<form action="/game" method="POST">
        <input type="hidden" name="method" value="${gameData.method}" />
        <button type="submit">Try Again</button>
        </form>`;
        })
        .catch((error) => {
          return console.error("Fetch error:", error);
        });
    }
  }, 1000);
}

function resetTimerColor() {
  let count = 0;

  const interval = setInterval(() => {
    count++;

    if (count >= 3) {
      clearInterval(interval);
      timer.style.color = "black";
    }
  }, 100);
}
