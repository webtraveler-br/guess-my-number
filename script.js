"use strict";

class Game {
  constructor(min, max, score) {
    this.min = min;
    this.max = max;
    this.random = this.getRandomNumber(min, max);
    this.dataBind(".score", "score", score);
    this.dataBind(".highscore", "highscore", 0);
    this.dataBind(".guess", "guess", "");
    this.dataBind(".message", "message", "Start guessing...");
    this.dataBind(".number", "number", "?");
    this.addEvent(".btn.check", "checkAction");
    this.addEvent(".btn.again", "againAction");
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * max + min);
  }

  // add a event to a dom element that keeps
  // the class environment (this)
  addEvent(selector, method) {
    const element = document.querySelector(selector);
    element.addEventListener("click", () => {
      this[method]();
    });
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
  checkAction() {
    const guess = Number(this.guess);
    if (guess === this.random) {
      if (Number(this.highscore) < Number(this.score))
        this.highscore = this.score;
      this.victory();
    } else {
      this.score = Number(this.score) - 1;
      this.message = guess > this.random ? "📈 Too high!" : "📉 Too low!";
    }
  }
  againAction() {
    this.random = this.getRandomNumber(this.min, this.max);
    this.number = "?";
    this.guess = "";
    document.body.style.backgroundColor = "#222222";
    this.message = "Start guessing...";
  }
  victory() {
    document.body.style.backgroundColor = "#60b347";
    this.number = this.random;
    this.message = "🎉 Correct Number!";
  }
}

const game = new Game(1, 20, 5);
