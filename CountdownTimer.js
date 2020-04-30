const Timer = function (hours, minutes, seconds) {
  this.hours = hours;
  this.minutes = minutes;
  this.seconds = seconds;
  this.isCounting = false;
  this.isFinished = false;
  this.interval;
  this.onFinish = function (timer) {};
  this.onUpdate = function (timer) {};
};
Timer.prototype.start = function (){
  this.isCounting = true;
  this.interval = setInterval(() => this.increment(), 1000);
};
Timer.prototype.pause = function (){
  this.isCounting = false;
  clearInterval(this.interval);
};
Timer.prototype.set = function (time){
  const {hours, minutes, seconds} = time;
  this.hours = Math.max(coalesce(hours, this.hours), 0);
  this.minutes = Math.clamp(coalesce(minutes, this.minutes), 0, 59);
  this.seconds = Math.clamp(coalesce(seconds, this.seconds), 0, 59);
  this.isFinished = false;
  this.pause();
  this.onUpdate(this);
};
Timer.prototype.increment = function (){
  if (this.isFinished){
    return;
  }
  this.seconds--;
  if (this.seconds < 0){
    this.seconds = 59;
    this.minutes--;
    if (this.minutes < 0){
      this.minutes = 59;
      this.hours--;
    }
  }
  if (this.seconds === 0 && this.minutes === 0 && this.hours === 0){
    this.isFinished = true;
    this.onFinish(this);
    this.pause();
  }
  this.onUpdate(this);
};
const coalesce = function (...args) {
  for (let arg of args){
    if (arg != null && arg === arg){
      return arg;
    }
  }
  return null;
};
Math.clamp = function (value, min, max){
  return Math.min(Math.max(min, value), max);
};

(() => {
  const onTimerUpdate = (timer) => {
    hoursDiv.innerHTML = timer.hours.toString();
    minutesDiv.innerHTML = ('0' +timer.minutes.toString()).slice(-2);
    secondsDiv.innerHTML = ('0' +timer.seconds.toString()).slice(-2);
  }
  const onTimerFinish = (timer) => {
    blinkInterval = setInterval(onBlink, 100);
  }
  const onReset = () => {
    timer.set({hours: resetHours, minutes: resetMinutes, seconds: resetSeconds});
  }
  const onStartStop = () => {
    if (timer.isCounting){
      this.innerHTML = "start";
      timer.pause();
    } else {
      this.innerHTML = "start";
      timer.set({
        hours: parseInt(hoursDiv.innerHTML),
        minutes: parseInt(minutesDiv.innerHTML),
        seconds: parseInt(secondsDiv.innerHTML),
      })
      timer.start();
    }
  }
  const onBlink = () => {
    if (!timer.isFinished){
      clearInterval(blinkInterval);
      return;
    }
    let primaryColor = getComputedStyle(root).getPropertyValue("--primaryColor");
    let secondaryColor = getComputedStyle(root).getPropertyValue("--secondaryColor");
    root.style.setProperty("--primaryColor", secondaryColor);
    root.style.setProperty("--secondaryColor", primaryColor);
  }
  const onNumberClick = function (event) {
    if (!timer.isCounting){
      selectedDiv = this;
      this.innerHTML = "";
      console.log(selectedDiv);
    }
  }
  let resetHours;
  let resetMinutes;
  let resetSeconds;
  const onOutsideClick = function (event) {
    resetHours = parseInt(hoursDiv.innerHTML),
    resetMinutes = parseInt(minutesDiv.innerHTML),
    resetSeconds = parseInt(secondsDiv.innerHTML),
    selectedDiv = null;
    console.log(selectedDiv);
  }
  const onKeyPress = function (event) {
    if (event.key >= 0 && event.key <= 9 && selectedDiv){
      selectedDiv.innerHTML = selectedDiv.innerHTML + event.key;
    }
  }
  let blinkInterval;
  let selectedDiv;
  let timeDivs = document.getElementsByClassName("countdown__number");
  for (let div of timeDivs){
    div.addEventListener("dblclick", onNumberClick);
  }
  document.documentElement.addEventListener("click", onOutsideClick);
  const root = document.documentElement;
  root.addEventListener("keydown", onKeyPress);
  const resetButton = document.getElementById("countdown__reset");
  resetButton.addEventListener("click", onReset);
  const startStopButton = document.getElementById("countdown__startStop");
  startStopButton.addEventListener("click", onStartStop);
  const hoursDiv = document.getElementById("countdown__hours");
  const minutesDiv = document.getElementById("countdown__minutes");
  const secondsDiv = document.getElementById("countdown__seconds");
  const timer = new Timer(0, 0, 10);
  hoursDiv.innerHTML = timer.hours.toString();
  minutesDiv.innerHTML = timer.minutes.toString();
  secondsDiv.innerHTML = timer.seconds.toString();
  timer.onUpdate = onTimerUpdate;
  timer.onFinish = onTimerFinish;
})();
