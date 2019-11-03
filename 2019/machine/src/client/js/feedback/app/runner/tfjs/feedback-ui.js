export class FeedbackUI {
    constructor() {
        
    }
    static isPredicting() {
        document.getElementById('webcam-outer-wrapper').style.border =
            '4px solid #00db8b';
    }
    static donePredicting() {
        document.getElementById('webcam-outer-wrapper').style.border =
            '2px solid #c8d0d8';
        FeedbackUI.removeActiveClass();
    }
    static stopPredicting() {
        document.getElementById('no-webcam').style.display = 'block';
        document.getElementById('webcam-inner-wrapper').className =
            'webcam-inner-wrapper center grey-bg';
    }
    static removeActiveClass() {
        $('.active').removeClass('active');
    }
    static toggleState(className) {
        console.log(className);
        FeedbackUI.removeActiveClass();
        $(`.${className}`).addClass('active');
    }
    static showLoading() {
        $('#webcam-inner-wrapper .loader').show();
    }
    static hideLoading() {
        $('#webcam-inner-wrapper .loader').hide();
    }
}