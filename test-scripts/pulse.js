const Gpio = require('pigpio').Gpio;

const led = new Gpio(18, {mode: Gpio.OUTPUT});
const button = new Gpio(4, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE
});

let ledOn = true;
let dutyCycle = 0;

setInterval(() => {
 if (ledOn) {
   led.pwmWrite(dutyCycle);
   dutyCycle += 5;
   if (dutyCycle > 255) {
     dutyCycle = 0;
   }
 } else {
  dutyCycle = 0;
  led.pwmWrite(dutyCycle);
 }
}, 20);


button.on('interrupt', (level) => {
 toggle();
});


function toggle() {
 if (ledOn) {
 ledOn = false; 
 } else {
 ledOn = true;
 }
}
