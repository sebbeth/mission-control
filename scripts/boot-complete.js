const Led = require('../helpers/Led.js');
const led = new Led(18);

led.pulse();
setTimeout(function() {
    led.on();
    setTimeout(function() {
        led.off();
	process.exit()
    }, 5000);
}, 5000);

