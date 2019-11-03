(function () {
    let wave = { leftCounter: 0, rightCounter: 0, counter: 0 };
    let TRexInstance = window.Runner.instance_;
    let keyDownEvtObj = {
        keyCode: 32,
        type: 'keydown',
        currentTarget: document,
        target: document.getElementById('t')
    };
    gest.start();
    gest.options.subscribeWithCallback(function (gesture) {
        console.log(gesture);
        if (!TRexInstance.started && !TRexInstance.crashed) {
            wave.counter++;        
            if (wave.counter > 2) {
                TRexInstance.onKeyDown(keyDownEvtObj);
                TRexInstance.onKeyUp({...keyDownEvtObj, type : 'keyup'});
                wave.counter = 0;
            }
        } else if (TRexInstance.crashed) {
            wave.counter++;
            /*if (gesture.left) {
                wave.leftCounter++;
                wave.rightCounter = 0;
                wave.leftCounter > 1 ? window.location = 'index.html' : undefined;
            } else if (gesture.right) {
                wave.leftCounter = 0;
                wave.rightCounter++;
                wave.rightCounter > 1 ? window.location = 'rasberry.html' : undefined;
            } else {*/
                wave.leftCounter = 0;
                wave.rightCounter = 0;
                if (wave.counter > 2) {
                    TRexInstance.onKeyDown(keyDownEvtObj);
                    TRexInstance.onKeyUp({...keyDownEvtObj, type : 'keyup'});
                    wave.counter = 0;
                }
            //}
        } else {
            TRexInstance.onKeyDown(keyDownEvtObj);
            TRexInstance.onKeyUp({...keyDownEvtObj, type : 'keyup'});
        }

    });
})();