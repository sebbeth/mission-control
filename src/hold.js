const Led = require('./Led.js');
const led = new Led(17);
const Gpio = require('pigpio').Gpio;

const button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });

console.log('...');

  button.on('interrupt', (level) => {
    if(level === 1) {
        led.flash();
    } else {
        led.off();
    }
   });

