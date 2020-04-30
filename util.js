const Util = {};

Util.coalesce = function (...args) {
    for (let arg of args){
      if (arg != null && arg === arg){
        return arg;
      }
    }
    return null;
};
Util.clamp = function (value, min, max){
    return Math.min(Math.max(min, value), max);
};

export default Util;