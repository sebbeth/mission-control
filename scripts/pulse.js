const Gpio = require('pigpio').Gpio;
const Led = require('../helpers/Led.js');

const ledR = new Led(18);
const buttonR = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });
const ledW = new Led(22);
const buttonW = new Gpio(17, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });




console.log('...');

buttonR.on('interrupt', (level) => {
  if(level === 1) {
      ledR.pulse();
  } else {
      ledR.off();
  }
});

buttonW.on('interrupt', (level) => {
  if(level === 1) {
      ledW.pulse();
  } else {
      ledW.off();
  }
});

