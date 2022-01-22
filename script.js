"use strict";

// a simple event controller
class Event {
  constructor(selector, type, listener) {
    this.element = document.querySelector(selector);
    this.type = type;
    this.listener = listener;
    this.start();
  }
  start() {
    this.element.addEventListener(this.type, this.listener);
  }
  stop() {
    this.element.removeEventListener(this.type, this.listener);
  }
}

class Game {
  constructor(min, max, score, states) {
    this.min = min;
    this.max = max;
    this.scoreQty = score;
    this.states = states;
    this.random = this.getRandomNumber(min, max);
    this.dataBind(".score", "score", score);
    this.dataBind(".highscore", "highscore", 0);
    this.dataBind(".guess", "guess", "");
    this.dataBind(".number", "number", "?");
    this.dataBind(".message", "message", "Start guessing...");
    // prettier-ignore
    // arrow function doesn't bind the "this" environment
    const check = [".check", "click", () => {this.checkAction()}];
    // prettier-ignore
    const again = [".again", "click", () => {this.againAction()}];
    this.check = new Event(...check);
    this.again = new Event(...again);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * max + min);
  }

  // this method uses getters and setters
  // to bind a variable to a dom element
  // acting like a proxy/pointer
  dataBind(selector, variableName, firstValue) {
    const element = document.querySelector(selector);
    const elementAttribute =
      element.tagName.toLowerCase() === "input" ? "value" : "textContent";
    element[elementAttribute] = firstValue;
    Object.defineProperty(this, variableName, {
      enumerable: true,
      get: function () {
        return element[elementAttribute];
      },
      set: function (value) {
        element[elementAttribute] = value;
      },
    });
  }

  changeState(state) {
    document.body.style.backgroundColor = state.backgroundColor;
    this.message = state.message;
  }

  // this is a good case of == usefullness
  // it converts strings into numbers before the comparison
  checkAction() {
    if (this.guess == this.random) {
      if (this.highscore < this.score) this.highscore = this.score;
      this.victory();
    } else {
      this.score -= 1;
      this.guess > this.random
        ? this.changeState(this.states.high)
        : this.changeState(this.states.low);
      if (this.score == 0) this.gameOver();
    }
  }

  againAction() {
    this.random = this.getRandomNumber(this.min, this.max);
    this.score = this.scoreQty;
    this.number = "?";
    this.guess = "";
    this.changeState(this.states.normal);
    this.check.start();
  }

  victory() {
    this.changeState(this.states.victory);
    this.number = this.random;
    this.check.stop();
  }

  gameOver() {
    this.changeState(this.states.gameOver);
    this.number = "X";
    this.check.stop();
  }
}

const game = new Game(1, 20, 5, {
  normal: { backgroundColor: "#222222", message: "Start guessing..." },
  high: { backgroundColor: "#222222", message: "📈 Too high!" },
  low: { backgroundColor: "#222222", message: "📉 Too low!" },
  victory: { backgroundColor: "#60b347", message: "🎉 Correct Number!" },
  gameOver: { backgroundColor: "#d30521", message: "💥 You lost the game!" },
});
