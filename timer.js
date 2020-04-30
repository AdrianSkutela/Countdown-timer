import Util from "./util.js";

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
    this.hours = Math.max(Util.coalesce(hours, this.hours), 0);
    this.minutes = Util.clamp(Util.coalesce(minutes, this.minutes), 0, 59);
    this.seconds = Util.clamp(Util.coalesce(seconds, this.seconds), 0, 59);
    this.isFinished = false;
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

  export default Timer;