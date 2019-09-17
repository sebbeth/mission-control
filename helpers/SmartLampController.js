const https = require("https");

module.exports = class SmartLampController {
    constructor(ifttt) {
        this.on = false;
        this.ifttt = ifttt;
    }


    on() {
        this.on = true;
    }

    off() {
        this.off = true;
    }

    toggle() {
        if (this.on) {
            this.on = false;
        } else {
            this.on = true;    
        }
        this.setLamp(this.on);
        return this.on;
    }


    setLamp(state) {
        let command = "";
        if (state) {
            command = "lampon";
        } else {
            command = "lampoff";
        }
        const url = "https://maker.ifttt.com/trigger/"+command+"/with/key/" + this.ifttt;
        https.get(url, res => {
            res.on("data", () => {});
        });  
    }
}