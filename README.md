# yld-boot

Wraps up the init process of an application. Mostly for convention rather than being lots of helper code.

```javascript
var boot = require("yld-boot")();

var environment = {};

// boot.callback wraps a callback as an async dependency
// required for the app booting. if it errors the boot fails
require("mongoose").connect(boot.callback(function(mongoose) {
  environment.mongoose = mongoose;
}));

require("redis")(boot.callback(function(redis) {
  environment.redis = redis;
}));

// boot.init gives you a callback to listen for all the app's 
// deps being ready
boot.init(function(err) {
  if(err) {
    console.error("could not start: " + err);
    process.exit(1);
  }

  require("server")(environment)
    .listen(PORT)
    .on("listening", function() {
      console.log("listening on %d", PORT); 
    });
});


if (require.main === module) {
  exports.run();
}
```

