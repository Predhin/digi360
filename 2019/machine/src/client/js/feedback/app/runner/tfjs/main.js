import { Feedback } from "./feedback.js";

export class Main {
    constructor() {
        this.run();
    }
    run() {
        $( document ).ready(function() {
            new Feedback();
        });
    }
}
new Main();