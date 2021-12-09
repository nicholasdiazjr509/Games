var game ={

    level: 1,
    turn: 0,
    score: 0,
    difficulty: 1,
    handler: false,
    //if a turn is active
    active: false,
    //if a turn is active
    shape: '.shape',
    //a cache to hold the pad/panel class
    genSequence: [],
    playerSequence: [],
    //array's for  the generated pads/panels the user selections.
    Thefivenotes: '.sound',

    init: function() {
        if(this.handler === false){
            this.initPanelHandler();
        }
        this.newGame();
    },
    initPanelHandler: function(){
        var that = this;
        $('.pad').on('mouseup', function() {
            if(that.active === true) {

                var pad = parseInt($(this).data('pad'), 10);
                that.flash($(this), 1, 300, pad);
                that.logPlayerSequence(pad);
            }
    });
        this.handler = true;
},
    newGame: function(){
        this.score = 0;
        this.level = 1;
        this.newLevel();
        this.displayScore();
        this.displayLevel();
    },
    newLevel: function(){
        this.genSequence.length = 0;
        this.playerSequence.length = 0;
        this.position = 0;
        this.active = true;
        this.turn = 0;
        this.randomPanel(this.level);
        this.displaySequence();
    },
    flash: function(element, times, speed, pad) {
        var that = this;
        //the cache
        if (times > 0) {
            that.playSound(pad)
            element.stop().animate({opacity: '1'},
                {
                    duration: 50,
                    complete: function () {
                        element.stop().animate({opacity: '0.6'}, 200);
       //used opacity for the flash simulation plus the sound to play with pads
                    }
                });
        }
        if (this > 0) {
            setTimeout(function () {
                that.flash(element, times, speed, pad);
            }, speed);
            times -= 1;
            //minus 1 for each time its called
        }
    },
    wrongSequence: function(){
        var correctPad = this.genSequence[this.turn],
            that = this;
        this.active = false;
        this.displayLevel();
        this.displayScore();

        setTimeout(function(){
            that.flash($(that.shape + correctPad), 3, 300, correctPad);
        }, 500);//seems to be correct, but doesn't flash 3 times
        $('.start').show();
        $('.difficulty').show();
        $('.gameOver').show();
    },
    playSound: function(clip){
        var sound = $('.sound' + clip)[0];
        sound.currentTime = 0;
        sound.play();
},
    randomPanel: function(passes){
    var i
    for(i = 0; i < passes; i++){
        this.genSequence.push(Math.floor(Math.random() * 4) +1);
    //random number generator and pushes them  to the gen number array, depends on what level
    }
},
    logPlayerSequence: function(pad){
        this.playerSequence.push(pad);
        this.checkSequence(pad);
},
    checkSequence: function(pad){
        var that = this;
    if( pad !== this.genSequence[this.turn]){
        this.wrongSequence();
    }else{
        this.keepScore();
        this.turn++;
    }

        if(this.turn === this.genSequence.length){
        this.level++;
        this.displayLevel();
        this.active = false;
        setTimeout(function () {
            that.newLevel();
        }, 1000);
            if(this.score === 42) {
                let Thefivenotes;
                alert("you won!!" );
            }
    }
},
    displaySequence: function(){
    var that = this;
    $.each(this.genSequence, function(index, val){
        setTimeout(function () {
            that.flash($(that.shape + val), 1, 300, val);
        }, 500 *index * that.difficulty);
    });
//goes over each value in the gen array and multiplies timeout by how  many times in the array
// so tht they play in sequential order and times the difficulty modifier.
},
    displayLevel: function(){
        $('.level h1').text('Level: ' + this.level);
},
    displayScore: function(){
        $('.score h1').text('Score: ' + this.score);

    },
    // gameOver: function(){
    //     $('.game-over').hide();
    // },
    keepScore: function(){
        var multiplier = 0;
        switch(this.difficulty){
            case '2':
                multiplier =1;
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


};
$(document).ready(function(){
    $('.start').on('mouseup', function() {
        $(this).hide();//had ' '  in (this)!!! ffs
            $('#start').click(function(){
                location.reload();
            });
        game.difficulty = $('input[name = difficulty]:checked').val();
        $('.difficulty').hide();
        $('.gameOver').hide();
        game.init();
    });

});