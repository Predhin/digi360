(function () {
    let wave = { count: 0, ready: true };
    $("#toggler").change(function () {
        wave.ready = false;
        showLoaderModal();
        let options = {
            type: 'PUT',
            url: '/api/control',
            data: {

            },
            contentType: "application/json",
            success: function (data, status) {
                alert(data.value);
                hideLoaderModal();
                wave.ready = true;
            },
            error: function (req, statusText, errorString) {
                console.log("Error Status : " + statusText + " - Error String : " + errorString);
                hideLoaderModal();
                wave.ready = true;

            },
            dataType: 'json'
        }
        if (this.checked) {
            let data = {
                control: {
                    led1: true
                }
            };
            options.data = JSON.stringify(data);
            $.ajax(options);

        } else {
            let data = {
                control: {
                    led1: false
                }
            };
            options.data = JSON.stringify(data);
            $.ajax(options);
        }
    });

    function readLEDState() {
        let options = {
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            url: '/api/state',
            success: function (data, status) {
                if (data) {
                    if (data.value === "ON") {
                        $('#toggler').prop('checked', true);
                    } else {
                        $('#toggler').prop('checked', false);
                    }
                }
                hideLoaderModal();
            },
            error: function (req, statusText, errorString) {
                console.log("Error Status : " + statusText + " - Error String : " + errorString);
                hideLoaderModal();
            }
        };
        showLoaderModal();
        $.ajax(options);
    }
    readLEDState();
    gest.start();
    gest.options.subscribeWithCallback(function (gesture) {
        if (wave.ready) {
            console.log(gesture);        
            wave.count++;
            if (wave.count % 3 === 0) {
                if ($('#toggler:checked').length > 0) {
                    $('#toggler').prop('checked', false);
                    $('#toggler').trigger('change');
                } else {
                    $('#toggler').prop('checked', true);
                    $('#toggler').trigger('change');
                }
            }
        }
    });
    function showLoaderModal(){
       $('.modal').modal('show');
    }
    function hideLoaderModal(){
       $('.modal').modal('hide');
    }
})();