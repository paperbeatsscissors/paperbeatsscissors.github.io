//------------------------------------------------- APP
var app;
var words;
var plain_words;
var seen = [],
    score = 0,
    playing = false;

$.ajax({
    url: '/static/js/words.json',
    contentType: 'application/json',
    dataType: 'json',
    success: function(result) {
        words = result;
    }
});

$.ajax({
    url: '/static/js/plain_words.json',
    contentType: 'application/json',
    dataType: 'json',
    success: function(result) {
        plain_words = result;
    }
});

(function($){
    app = {
        //------------------------------------------------- Functions
        random: function(max) { return Math.floor(Math.random() * Math.floor(max)); },
        roll: function() {
            var max = words.length - 1,
                word = words[app.random(max)];

            if (seen.includes(word.id)) {
                app.roll();
            } else {
                seen.push(word.id);
                $('.module_game--word').text(word.word);
                $('.module_game--prohibited-words').html('');
                for (i = 0; i < word.prohibited.length; i++) {
                    if (i < 6) {
                        $('.module_game--prohibited-words').append(`<div class="module_game--prohibited-word">${word.prohibited[i]}</div>`);
                    }
                }
            }
        },
        format: function(minutes, seconds) {
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            $('.js--timer').text(minutes + ':' + seconds);
        },
        end: function() {
            if (this.expired()) {
                playing = false;
                score = 0;
                $('.module_game--word').text("Time's Up!");
                $('.module_game').addClass('is--over');
                $('.module_game--action').prop('disabled', true);
            }
        },
        randomWord: function() {
            $.ajax({
                url: '/static/js/plain_words.json',
                contentType: 'application/json',
                dataType: 'json',
                success: function(result){
                    var max = result.length - 1,
                        word = result[app.random(max)];

                    $.ajax({
                        url: 'https://api.wordassociations.net/associations/v1.0/json/search?apikey=01e6bc6a-b7e5-470a-b010-1a9140f888dc&text='+word+'&lang=en&type=response&limit=6&pos=noun,adjective,verb',
                        crossDomain: true,
                        contentType: 'application/json',
                        dataType: 'json',
                        headers: {
                            'accept': 'application/json',
                            'Access-Control-Allow-Origin':'*'
                        },
                        success: function(r){
                            console.log(r);
                        }
                    });
                }
            });
        },
        //------------------------------------------------- Actions
        actions: function() {

            app.randomWord();

            var timer = new CountDownTimer(120),
                timeObj = CountDownTimer.parse(120);

            app.format(timeObj.minutes, timeObj.seconds);
            timer.onTick(app.format).onTick(app.end);

            $('.js--next').on('click', function(e){
                e.preventDefault();

                if (seen.length == 0) { $('.module_game--action.js--next').text('Next ↝'); }
                if ($('.module_game').hasClass('is--over')) { $('.module_game').removeClass('is--over') }

                app.roll();

                if (!playing) {
                    timer.start();
                    playing = true;
                    $('.module_game--action').prop('disabled', false);
                    $('.js--score').text(score);
                } else if (playing) {
                    score++;
                    $('.js--score').text(score);
                }
            });

            $('.js--skip').on('click', function(e){
                e.preventDefault();
                app.roll();
            });

        }
    };

    $(document).ready(function(){
        app.actions();
    });
})(jQuery);