const Gpio = require('pigpio').Gpio;
const Led = require('./Led.js');
const config = require('../config.json');
const led = new Led(17);
const lampState = 0;

const button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });

console.log('...');

button.on('interrupt', (level) => {
  if(level === 1) {
      if (lampState === 0) {
          lampState = 1;
      } else {
          lampState = 0;
      }
      setLamp(lampState);
  } else {
  }
});


function setLamp(state) {
    const key = config.ifttt-key;
    if (config.ifttt-key) {
        let command = "";
        if (state) {
            command = "lampon";
        } else {
            command = "lampoff";
        }
        fetch("https://maker.ifttt.com/trigger/"+command+"/with/key/" + key);
    } else {
        console.error("No IFTTT key");
        
    }
}