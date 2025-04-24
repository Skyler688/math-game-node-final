const UserSchema = require("../models/user");
const authMiddleware = require("../middleware/userSession");

const playPage = [
  authMiddleware,
  (req, res) => {
    try {
      const { method } = req.body;
      console.log(method);
      const username = req.session.user.username;
      res.render("game", { user: username, method: method });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  },
];

const generateQuestion = [
  authMiddleware,
  (req, res) => {
    try {
      let { method, correct, time, score, starting } = req.body;

      console.log(method);
      console.log("Correct " + correct);

      const num_1 = Math.floor(Math.random() * (10 + score * 5));
      const num_2 = Math.floor(Math.random() * (10 + score * 5));

      let answer = 0;
      if (method === "Addition") {
        answer = num_1 + num_2;
      } else if (method === "Subtraction") {
        answer = num_1 - num_2;
      } else if (method === "Multiplication") {
        answer = num_1 * num_2;
      } else if (method === "Division") {
        answer = num_1 / num_2;
      } else if (method === "Mixed") {
        const sel = Math.random();
        if (sel <= 0.25) {
          method = "Addition";
          answer = num_1 + num_2;
        } else if (sel > 0.25 && sel <= 0.5) {
          method = "Subtraction";
          answer = num_1 - num_2;
        } else if (sel > 0.5 && sel <= 0.75) {
          method = "Multiplication";
          answer = num_1 * num_2;
        } else {
          method = "Division";
          answer = num_1 / num_2;
        }
      } else {
        console.log("Error invalid (method) in request.");
        return res.status(500).send("Error invalid (method) in request");
      }

      console.log("Answer: " + answer);
      answer = Math.round(answer * 100) / 100;
      const wrongAnswers = [0, 0, 0];

      for (let i = 0; i < 3; i++) {
        let randNum;
        if (method === "Division") {
          randNum = Math.random() * (Math.random() * 10);
        } else {
          randNum = Math.floor(Math.random() * (Math.random() * 10));
        }
        const operation = Math.random();

        if (operation < 0.5) {
          if (!answer || Number.isNaN(answer) || !Number.isFinite(answer)) {
            wrong = 0 + randNum;
          } else {
            wrong = answer + randNum;
          }
        } else {
          if (!answer || Number.isNaN(answer) || !Number.isFinite(answer)) {
            wrong = 0 - randNum;
          } else {
            wrong = answer - randNum;
          }
        }

        if (wrongAnswers.includes(wrong) || wrong === answer) {
          i--;
        } else {
          wrongAnswers[i] = wrong;

          wrongAnswers[i] = Math.round(wrongAnswers[i] * 100) / 100;
        }
      }

      if (correct && !starting) {
        time += 10;
        score++;
      } else if (!correct) {
        time -= 10;
      }

      console.log(num_1);
      res.status(200).json({
        num_1: num_1,
        method: method,
        num_2: num_2,
        answer: answer,
        wrongAnswers: wrongAnswers,
        time: time,
        score: score,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  },
];

const getHighScore = [
  authMiddleware,
  async (req, res) => {
    try {
      const { gameType, score } = req.body;
      const username = req.session.user.username;

      console.log(username);
      console.log(gameType);
      console.log(score);
      const user = await UserSchema.findOne({ username: username });
      if (!user) {
        console.log("User not found");
        return res
          .status(404)
          .json({ message: `User ${username} not found :(` });
      }

      let scoreIndex;
      switch (gameType) {
        case "Addition":
          scoreIndex = 0;
          break;
        case "Subtraction":
          scoreIndex = 1;
          break;
        case "Multiplication":
          scoreIndex = 2;
          break;
        case "Division":
          scoreIndex = 3;
          break;
        case "Mixed":
          scoreIndex = 4;
          break;
      }

      let newHighScore = false;
      if (user.highScore[scoreIndex] < score) {
        // new high score
        user.highScore[scoreIndex] = score;
        const updateScore = await UserSchema.findOneAndReplace(
          { username: username },
          user
        );
        if (!updateScore) {
          console.log("Error updating highScore");
          return res
            .status(500)
            .json({ message: "Failed to save to data base" });
        }

        newHighScore = true;
      }

      res.status(200).json({
        message: "user found",
        newHighScore: newHighScore,
        highScore: user.highScore[scoreIndex],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  },
];

module.exports = { playPage, generateQuestion, getHighScore };
