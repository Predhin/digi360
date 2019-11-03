import { Feedback } from "./feedback.js";

export class Main {
    constructor() {
        console.info(":: Loading app, please wait! ::")
        this.run();
    }
    run() {
        $( document ).ready(function() {
            new Feedback();
        });
    }
}
new Main();