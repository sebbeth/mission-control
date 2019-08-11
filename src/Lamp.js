const Gpio = require('pigpio').Gpio;
const Led = require('./Led.js');
const config = require('../config.json');
const https = require("https");
const led = new Led(18);
let lampState = 0;

const button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });

console.log('...');

button.on('interrupt', (level) => {
  if(level === 1) {
      if (lampState === 0) {
          led.pulse();
          lampState = 1;
      } else {
          lampState = 0;
      }
      setLamp(lampState);
  } else {
  }
});


function setLamp(state) {
    const key = config.ifttt;        
    if (config.ifttt) {
        let command = "";
        if (state) {
            command = "lampon";
        } else {
            command = "lampoff";
        }
        const url = "https://maker.ifttt.com/trigger/"+command+"/with/key/" + key;
        https.get(url, res => {
            res.on("data", () => {
            if (state) {
                led.on();
            } else {
                led.off();
            }
          })
        });  
    } else {
        console.error("No IFTTT key");
        
    }
}
