(function(){
    let wave = {count : 0};
    gest.start();
    gest.options.subscribeWithCallback(function (gesture) {
        console.log(gesture);
        wave.count ++;
        if(wave.count > 2){
            console.log('Redirecting to Game Page');
            window.location = 'game.html';
        }
    });
})();