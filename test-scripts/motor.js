const Gpio = require('pigpio').Gpio;

const pinA = new Gpio(4, { mode: Gpio.OUTPUT });
const pinB = new Gpio(17, { mode: Gpio.OUTPUT });
const pinC = new Gpio(18, { mode: Gpio.OUTPUT });
const pinD = new Gpio(23, { mode: Gpio.OUTPUT });

const pwmMax = 255;


let cycles = 0;
console.log("Starting!");
const sleep = 100;

const total = 25;

tick();

function safePins() {
    pinA.pwmWrite(0);
    pinB.pwmWrite(0);
    pinC.pwmWrite(0);
    pinD.pwmWrite(0);
}

function stepA() {
    pinA.pwmWrite(pwmMax);
    pinB.pwmWrite(0);
    pinC.pwmWrite(0);
    pinD.pwmWrite(0);
}

function stepB() {
    pinA.pwmWrite(0);
    pinB.pwmWrite(0);
    pinC.pwmWrite(pwmMax);
    pinD.pwmWrite(0);
}

function stepC() {
    pinA.pwmWrite(0);
    pinB.pwmWrite(pwmMax);
    pinC.pwmWrite(0);
    pinD.pwmWrite(0);
}

function stepD() {
    pinA.pwmWrite(0);
    pinB.pwmWrite(0);
    pinC.pwmWrite(0);
    pinD.pwmWrite(pwmMax);
}

function tick() {
    console.log("t", cycles);
    stepA();
    setTimeout(() => {
        stepB();
        setTimeout(() => {
            stepC();
            setTimeout(() => {
                stepD();
                setTimeout(() => {

                    cycles++;
                    if (cycles === total) {
                        console.log("Stopping");
                        safePins();
                    } else {
                        tick();
                    }
                }, sleep);
            }, sleep);
        }, sleep);
    }, sleep);
}


// let dutyCycle = 0;

// setInterval(() => {
//   led.pwmWrite(dutyCycle);

//   dutyCycle += 5;
//   if (dutyCycle > pwmMax) {
//     dutyCycle = 0;
//   }
// }, 20);

