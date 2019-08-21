// const Gpio = require('pigpio').Gpio;
// const Led = require('../helpers/Led.js');

/*
A manager for the button box, capable of switching between functions
*/

const Modes = {
    MENU: 0,
    A: 1,
    B: 2,
    C: 3,
    SHUTDOWN: 4
}


let mode = 0;
let selector = 1;

led.pulse();
setTimeout(function() {
    led.on();
    setTimeout(function() {
        led.off();
	process.exit()
    }, 5000);
}, 500);

switch (mode) {
    case Modes.MENU:  



    console.log("MENU");
    
    break;
    case Modes.A: 
    console.log("A");
 
    break;    
    case Modes.B: 
    console.log("B");
 
    break;    
    case Modes.C:  
    console.log("C");

    break;
    case Modes.SHUTDOWN:
    console.log("Shutdown");
  
    break;
    default:
        break;
}





