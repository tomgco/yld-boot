var getStack = require('get-stack');
var EventEmitter = require("events").EventEmitter;

module.exports = function booter(config) {

  var events = new EventEmitter;
  var api = {};

  var waitingFor = {};
  var waiters = 0;
  var heard = 0;

  api.callback = function(name, cb) {

    var context;

    if(cb == null) {
      cb = name;
      context = getStack(1);
    } else {
      context = name + " " + getStack(1);
    }

    var waitingFor = {};
    var waitingId = waiters++;

    return function(err) {
      if(err) {
        return fail(err, context);
      }
      cb.apply(null, [].slice.call(arguments, 1));

      if(!waitingFor[waitingId]) {
        waitingFor[waitingId] = true;
        heard += 1;
        if(heard === waiters) {
          ready();
        }
      }
    }
  }

  api.init = function(cb) {
    events.once("fail", function(err, name) {
      cb(name + " failed with " + err);
    });
    events.once("ready", cb);
  }

  function fail(err, name) {
    events.emit("fail", err, name);
    events.removeAllListeners();
  }

  function ready() {
    events.emit("error");
    events.removeAllListeners();
  }

  return api;
}
