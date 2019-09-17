const Gpio = require('pigpio').Gpio;
const Led = require('../helpers/Led.js');
const SmartLampController = require('../helpers/SmartLampController.js');
const config = require('../config.json');
const fs = require('fs');
const { exec } = require('child_process');
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

let smartLampController = new SmartLampController(config.ifttt);

startup();

function startup() {
  
 ledR.on();
 ledW.on();
 setTimeout(() => {
     ledR.off();
     ledW.off();
     ledW.blip(mode);
     setTimeout(() => {
        ledW.off();
        setMode(mode);
     },1000);
  },1000);
}


function getMode() {
    var path = process.cwd();
    try {
        var buffer = fs.readFileSync(path + "/prefs");
        const prefs = JSON.parse(buffer.toString());
        console.log(prefs);
        if ((prefs === undefined) ||
        (prefs.mode === Modes.SHUTDOWN) || 
        (prefs.mode === undefined)) {
            setMode(0);
            return 0;
        }
        return prefs.mode;
    } catch (error) {
        return 0;
    }
    
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
            console.log("Smart Lamp");

        break;    
        case Modes.C:  
        console.log("C");
        break;
        case Modes.SHUTDOWN:
            console.log("Shutdown");
            
            exec("sudo halt");
        break;
        default:
            break;
    }
    mode = newMode;
    if (mode !== Modes.SHUTDOWN) { // Don't save the mode if it is shutdown so that we don't get into a reboot loop
        fs.writeFile('prefs', JSON.stringify({"mode": mode}), function (err) {});
    }
}

buttonW.on('interrupt', (level) => {
    if(level === 1) {
        whiteButtonHoldTimer = setTimeout(() => {        
            console.log("HOLD!");
            setMode(Modes.MENU);
        }, 5000);
        switch (mode) {
            case Modes.MENU:
            break;
            case Modes.B:
            break; 
            case Modes.C:
                ledW.pulse();
            break; 
            default:
            break;
        }
        
    } else {
        clearTimeout(whiteButtonHoldTimer); 
        switch (mode) {
            case Modes.MENU:
                iterateSelector();     
            break;
            case Modes.B:
                const lampIsOn = smartLampController.toggle();  
                (lampIsOn) ? ledW.on() : ledW.off();
            break; 
            case Modes.C:
                ledW.off();
            break; 
            default:
            break;
        }
    }
});

buttonR.on('interrupt', (level) => {

    if(level === 1) {
            switch (mode) {
                case Modes.MENU:
                    console.log("Mode " + selector + " selected");
                    ledR.on();
                    ledW.off();
                    setTimeout(() => {
                        ledR.off();
                        setMode(selector);
                    },1000);
                break;
                case Modes.B:
                break; 
                case Modes.C:
                    ledR.pulse();
                break; 
                default:
                break;
            }
    } else {
        switch (mode) {
            case Modes.MENU:
            break;
            case Modes.B:
            break; 
            case Modes.C:
                ledR.off();
            break; 
            default:
            break;
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



