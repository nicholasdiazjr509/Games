var game ={
    level: 1,
    turn: 0,
    score: 0,
    difficulty: 1,
    handler: false,
    active: false,
    shape: '.shape',
    genSequence: [],
    playerSequence: [],

    init: function() {
        if(this.handler === false){
            this.initPanelHandler();
        }
        this.newGame();
    },
    initPanelHandler: function(){
        var that = this;
        $('.panel').on('mouseup', function() {
            that.flash($(this), 1, 300, panel);
           if(that.active === this){

            var panel = parseInt($(this).data('panel'), 10);
            that.flash($(this), 1, 300, panel);
            that.logPlayerSequence(panel);
        }
    });
        this.handler = true;
},
    newGame: function(){
        this.score = 0;
        this.level = 1;
        this.newLevel();
        this.displayScore();
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
    flash: function(element, times, speed, panel) {
        var that = this;
        if (times > 0) {
            element.stop().animate({opacity: "1"},
                {
                    duration: 50,
                    complete: function () {
                        element.stop().animate({opacity: '0.6'}, 200);
                    }
                });
        }
        if (this > 0) {
            setTimeout(function () {
                that.flash(element, times, speed, panel);
            }, speed);
            times -= 1;
        }
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
    }
},
    logPlayerSequence: function(panel){
        this.playSequence.push(panel);
        this.checkSequence(panel);
},
    checkSequence: function(panel){
        var that = this;
    if( panel !== this.genSequence[this.turn]){
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
    }
},
    displaySequence: function(){
    var that = this;
    $(this.genSequence, function(index, val){
        setTimeout(function () {
            that.flash($(that.shape + val), 1, 300, val);
        }, 500 *index * that.difficulty);
    });

},
    displayLevel: function(){
        $('.score h1').text('Score: ' + this.score);
},
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
    wrongSequence: function(){
        var correctPanel = this.genSequence[this.turn],
            that = this;
        this.active = false;
        this.displayLevel();
        this.displayScore();

        setTimeout(function(){
        that.flash($(that.shape + correctPanel), 3, 300, correctPanel);
        }, 500);
    $('.start').show();
    $('.difficulty').show();
    }
};
$(document).ready(function(){
    $('.start').on('mouseup', function() {
        $('this').hide();
        game.difficulty = $('input[name = difficulty]:checked').val();
        $('difficulty').hide();
        game.init();
    });

});