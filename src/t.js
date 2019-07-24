
class Led {
    constructor(pinNumber, gpio) {
        this.gpio = gpio;
        this.pinNumber = pinNumber;
        this.led = new Gpio(pinNumber, {mode: Gpio.OUTPUT});
    }
}
