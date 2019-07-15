
const Gpio = require('onoff').Gpio; // Gpio class
const led = new Gpio(17, 'out');       // Export GPIO17 as an output
console.log(led);
led.writeSync(0.5);

setTimeout(_ => {
console.log("Stop");
  led.unexport();    // Unexport GPIO and free resources
}, 5000);


