const Gpio = require('pigpio').Gpio;


const states = {
    ON: 0,
    OFF: 1,
    PULSING: 2,
    FLASHING: 3
}

module.exports = class Led {
    constructor(pinNumber) {
        this.state = states.OFF;
        this.pinNumber = pinNumber;
        this.led = new Gpio(pinNumber, {mode: Gpio.OUTPUT});
        this.intervalId = null;
    }

    execute() {
        if (this.intervalId != null) { // Clear the interval loop if it is running
            clearInterval(this.intervalId); 
            this.intervalId = null;
        };
        switch (this.state) {
            case states.OFF:
                this.led.digitalWrite(0)         
                break;
            case states.ON:
                this.led.digitalWrite(1)                
                break;        
            case states.PULSING:
                let x = 0;
                let dutyCycle = 0;
                this.intervalId = setInterval(() => { // the duty cycle will follow a sin wave.
                    dutyCycle = Math.floor((Math.sin(x) * 127.5) + 127.5);
                    console.log(dutyCycle, x);
                    this.led.pwmWrite(dutyCycle);
                    x += 0.1;
                    if (x >= 2 * Math.PI) {
                        x = 0;
                    }
                  }, 20);           
                break;  
            case states.FLASHING:
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
                break;  
            default:
                break;
        }
    }

    on() {
        this.state = states.ON;
        this.execute();
    }
    off() {
        this.state = states.OFF;
        this.execute();
    }
    pulse() {
        this.state = states.PULSING;
        this.execute();
    }
    flash() {
        this.state = states.FLASHING;
        this.execute();
    }
}
