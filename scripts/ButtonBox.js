const Gpio = require('pigpio').Gpio;
const Led = require('../helpers/Led.js');
const fs = require('fs');

/*
A manager for the button box, capable of switching between functions
*/


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

const Modes = {
    MENU: 0,
    A: 1,
    B: 2,
    C: 3,
    SHUTDOWN: 4
}

let mode = getMode();
let selector = Modes.A;
let whiteButtonHoldTimer = null;

startup();

function startup() {
  
 ledR.on();
 ledW.on();
 setTimeout(() => {
     ledR.off();
     ledW.off();
     ledW.blip(selector);
     setTimeout(() => {
        ledW.off();
        setMode(mode);
     },1000);
  },1000);
}


function getMode() {

}

function setMode(newMode) { 
    // This function controls setup of each mode
    //reset LEDS and instantate api listeners here
    switch (newMode) {
        case Modes.MENU:  
            ledR.off();
            ledW.off();
            displaySelector();
        break;
        case Modes.A: 
            console.log("A");
    
        break;    
        case Modes.B: 
            console.log("B");
            ledR.off();
            ledW.off();
            ledR.pulse();

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
    mode = newMode;

    fs.writeFile('prefs', JSON.stringify({"mode": mode}), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
}

buttonW.on('interrupt', (level) => {
    if(level === 1) {
        whiteButtonHoldTimer = setTimeout(() => {        
            console.log("HOLD!");
            setMode(Modes.MENU);
        }, 5000);
        if (mode === Modes.MENU) {
            iterateSelector();
        }
    } else {
        clearTimeout(whiteButtonHoldTimer); 
    }
});

buttonR.on('interrupt', (level) => {

    if (mode === Modes.MENU) {
        if(level === 1) {
            console.log("Mode " + selector + " selected");
            ledR.on();
            ledW.off();
            setTimeout(() => {
                ledR.off();
                setMode(selector);
            },1000);
        } 
    }
});

function displaySelector() {
    console.log("Selector",selector);
    ledW.blip(selector);
}

function iterateSelector() {
    if (selector < Modes.SHUTDOWN) {
        selector++;
    } else {
        selector = Modes.A;
    }
    displaySelector();
}



