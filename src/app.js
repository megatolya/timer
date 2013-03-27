var defaults = {
    time: 0,
    text: 'До конца перерыва осталось:'
};
var timer = null;
var stopped = false;
var layout;

function save(key, value) { localStorage.setItem(key, JSON.stringify(value));
}

function load(key) {
    return JSON.parse(localStorage.getItem(key)) || null;
}

function storageIni () {
    if (!load('timer')) {
        save('timer', defaults);
    }
    timer = load('timer');
}

function makeTime (time) {
    var date = new Date(time);
    var mins = date.getMinutes();
    var secs = date.getSeconds();

    secs = secs < 10 ? ('0' + secs) : secs;
    return mins + ':' + secs;
}

function draw () {
    $('.time').html(makeTime(timer.time));
    $('.text').html(timer.text);
}

function timeChanged (time) {
    if (timer.time - 1000 < 1000 && !time && !stopped) {
        timer.time = 0;
        stopped = true;
        draw();
    } else if (!stopped && !time) {
        timer.time = timer.time - 1000;
        draw();
    }
    if (time) {
        timer.time = time;
    }
    save('timer', timer);
}

function timeInputFocus () {
    stopped = true;
}

function timeInputChanged () {
    stopped = false;
    var $this = $(this);

    var time = $this.text();
    var matches = time.match(/(.*):(.*)/);
    stamp = matches[1] * 60 * 1000 + matches[2] * 1000;
    timeChanged(stamp);
}

function textInputChanged () {
    text = $(this).html();
    timer.text = text;
    save('timer', timer);
}

function locateLayout() {
    var winHeigth = $(window).height();
    layout.css('top', winHeigth / 2 - layout.height() / 2 );
}
$(function() {
    storageIni();
    draw();
    layout = $('.layout');
    locateLayout();
    $('.time').blur(timeInputChanged).focus(timeInputFocus);
    $('.text').blur(textInputChanged);

    setInterval(function() {
        timeChanged();
    }, 1000);
});

$(window).resize(function() {
    locateLayout();
});
