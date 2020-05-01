
import Timer from "./timer.js";
import InputBinder from "./inputBinder.js";
import Util from "./util.js"
//TODO: add input validation
(() => {
  let blinkInterval;
  const root = document.documentElement;
  const resetButton = document.getElementById("countdown__reset");
  const startStopButton = document.getElementById("countdown__startStop");
  const timer = new Timer(0, 0, 10);
  let resetTime = {hours: 0, minutes: 0, seconds: 10};
  const hours = new InputBinder(document.getElementById("countdown__hours"));
  const minutes = new InputBinder(document.getElementById("countdown__minutes"));
  const seconds = new InputBinder(document.getElementById("countdown__seconds"));

  const onTimerUpdate = (timer) => {
    hours.value = timer.hours;
    minutes.value = timer.minutes;
    seconds.value = timer.seconds;
  }
  const onTimerFinish = (timer) => {
    blinkInterval = setInterval(onBlink, 100);
  }
  const onReset = () => {
    timer.set(resetTime);
    timer.pause();
    startStopButton.innerHTML = "start";
  }
  const onStartStop = function () {
    if (timer.isCounting){
      this.innerHTML = "start";
      timer.pause();
    } else {
      this.innerHTML = "stop";
      timer.start();
    }
  }
  //TODO: change blinking to smoother color transition
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
  const onInputChanged = () => {
    if (!timer.isCounting){
      timer.hours = hours.value = Util.clamp(hours.value, 0, 23);
      timer.minutes = minutes.value = Util.clamp(minutes.value, 0, 59);
      timer.seconds = seconds.value = Util.clamp(seconds.value, 0, 59);

      resetTime = {
        hours: hours.value,
        minutes: minutes.value,
        seconds: seconds.value
      }
    }
  }

  hours.fixedWidth = 2;
  minutes.fixedWidth = 2;
  seconds.fixedWidth = 2;

  hours.value = 0;
  minutes.value = 0;
  seconds.value = 10;

  hours.onInputChanged = onInputChanged;
  minutes.onInputChanged = onInputChanged;
  seconds.onInputChanged = onInputChanged;

  resetButton.addEventListener("click", onReset);
  startStopButton.addEventListener("click", onStartStop);

  timer.onUpdate = onTimerUpdate;
  timer.onFinish = onTimerFinish;
})();
