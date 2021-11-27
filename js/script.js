var game = {
    level: 1,
    turn: 0,
    difficulty: 1,
    score: 0,
    active: false,
    handler: false,
    shape: '.shape',
    genSequence: [],
    playSequence: [],

    init: function () {
        if (this.handler === false) {
            this.initPadHandler();
        }
        this.newGame(); //to reset the game.
    },

    initPadHandler: function () {
        var that = this;
        $('.pad').on('mouseup', function () {
            if (that.active === true) {

                var pad = parseInt($(this).data('pad'), 10);
                that.flash($(this), 1, 300, pad);
                that.logPlayerSequence(pad);
            }
        });
        this.handler = true;
    },

    newGame: function () {
        this.score = 0;
        this.level = 1;
        this.newLevel();
        this.displayLevel();
        this.displayScore();
    },
    newLevel: function () {
        this.genSequence.length = 0;
        this.playSequence.length = 0;
        this.position = 0;
        this.active = true;
        this.turn = 0;

        this.randomPad(this.level);
        this.displaySequence();
    },
    flash: function (element, times, speed, pad) {
        var that = this;
        if (times > 0) {
            that.playSound(pad);
            element.stop().animate({opacity: '1'}, {
                duration: 50,
                complete: function () {
                    element.stop().animate({opacity: '0.6'}, 200);
                }//"animation" to create a flash
            });
        }
        if (this > 0) {
            setTimeout(function () {
                that.flash(element, times, speed, pad);
            }, speed);
            times -= 1;
        }

    },
    playSound: function (clip) {
        var sound = $('.sound' + clip)[0];
        //console.log(sound);
        // console.log($('.sound' + clip));
        sound.currentTime = 0;
        sound.play();
    },

    randomPad: function (passes) {
        var i;
        for (i = 0; i < passes; i++) {
            this.genSequence.push(Math.floor(Math.random() * 4) + 1);
        }
    },

    logPlayerSequence: function (pad) {
        this.playSequence.push(pad);
        this.checkSequence(pad);
    },
    checkSequence: function (pad) {
        var that = this;
        if (pad !== this.genSequence[this.turn]) {
            this.wrongSequence();
        } else {
            this.keepScore();
            this.turn++;
        }
        if (this.turn === this.genSequence.length) {
            this.level++;
            this.displayLevel();
            this.active = false;
            setTimeout(function () {
                that.newLevel();
            }, 1000);
        }
    },

    displaySequence: function () {
        var that = this;
        $.each(this.genSequence, function (index, val) {
            setTimeout(function () {
                that.flash($(that.shape + val), 1, 300, val);
            }, 500 * index * that.difficulty);
        });
    },

    displayLevel: function () {
        $('.level h1').text('Level: ' + this.level);
    },

    displayScore: function () {
        $('.score h1').text('Score: ' + this.score);
    },

    keepScore: function () {
        var multiplier = 0;

        switch (this.difficulty) {
            case '2':
                multiplier = 1;
                break;
            case '1':
                multiplier = 2;
                break;
            case '0.5':
                multiplier = 3;
                break;
            case '0.25':
                multiplier = 4;
                break;
        }
        this.score += (multiplier);
        this.displayScore();
    },
    wrongSequence: function () {
        var correctPad = this.genSequence[this.turn],
            that = this;
        this.active = false;
        this.displayLevel();
        this.displayScore();

        setTimeout(function () {
            that.flash($(that.shape + correctPad), 3, 300, correctPad);
        }, 500);

        $('.start').show();
        $('.difficulty').show();
    }
};
$(document).ready(function () {
    $('.start').on('mouseup', function () {
        $(this).hide();
        game.difficulty = $('input[name=difficulty]:checked').val();
        $('.difficulty').hide();
        game.init();
    });

});