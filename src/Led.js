const Gpio = require('pigpio').Gpio;

module.exports = class Led {
    constructor(pinNumber) {
        this.pinNumber = pinNumber;
        this.led = new Gpio(pinNumber, {mode: Gpio.OUTPUT});
        this.intervalId = null;
    }

    stopLoop() {
        if (this.intervalId != null) { // Clear the interval loop if it is running
            clearInterval(this.intervalId); 
            this.intervalId = null;
        }; 
    }

    on() {
        this.stopLoop();
        this.led.digitalWrite(1);         
    }
    off() {
        this.stopLoop();
        this.led.digitalWrite(0); 
    }
    pulse() {
        this.stopLoop();
        let x = 0;
        let dutyCycle = 0;
        this.intervalId = setInterval(() => { // the duty cycle will follow a sin wave.
            dutyCycle = Math.floor((Math.cos(x) * -127.5) + 127.5);
            this.led.pwmWrite(dutyCycle);
            x += 0.1;
            if (x >= 2 * Math.PI) {
                x = 0;
            }
        }, 20);   
    }
    flash() {
        this.stopLoop();
        let on = false;
        this.intervalId = setInterval(() => {
            if (on) {
                this.led.digitalWrite(0);
                on = false;                
            } else {
                this.led.digitalWrite(1);
                on = true;
            }
        }, 200);         
    }
}
