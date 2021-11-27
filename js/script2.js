$(document).ready(function(){
    var button = $(".buttons");
    var allButtons =
        [$("#red"),
         $("#blue"),
         $("#green"),
         $("#yellow")];
    var sequence, playerTurn, wins, strict, seqPosition;

    startGame();

    function startGame(){
        strict = confirm("Would like to play at a higher difficulty?");
        sequence = [];
        playerTurn = false;
        wins = 0;

        aiTurn();
    }
    function aiTurn(){
        seqPosition = 0;
        $("#count").html(wins);
        if(wins === 20) {
            alert("You win!");
            startGame();
        }else{
            sequence.push(Math.floor(Math.random() * 4) +1)

            playSequence();
        }
    }
    function playSequence() {
        playSound(allButtons[sequence[0]]);
        var i = 0;
        var progress = false;
        loop();

        function loop() {
            i++;
            if (i === sequence.length)
                return;

            setTimeout(function () {
                playSound(allButtons[sequence[i]])
                loop();
            }, 1000);
        };
        playerTurn = true;
    }
    function playSound(btn){
        btn.toggleClass("act");
        var src;
        switch(parseInt(btn.attr("val"))){
            case 0:
                  src="sounds/mp3/simonSound1.mp3";
            break;
            case 1:
                  src="sounds/mp3/simonSound2.mp3";
            break;
            case 2:
                  src="sounds/mp3/simonSound3.mp3";
            break;
            case 3:
                  src="sounds/mp3/simonSound4.mp3";
            break;
        }
        var audio = new Audio(src);
        audio.play();
        setTimeout(function () {
            btn.toggleClass("act")
        }, 700);
        }
    button.on("click", function(){
        if(playerTurn){
            var btnVal = parseInt($(this).attr("val"));
            if(btnVal === sequence[seqPosition]){
                playSound(allButtons[sequence[seqPosition]]);
                seqPosition++;
                setTimeout(function () {
                    if(seqPosition === sequence.length){
                        playerTurn = false;
                        wins++;
                        computerTrun();
                    }
                }, 1000);
            }else {
                playerTurn = false;
                if(strict) {
                    alert("You Lose!!");
                    startGame();
                }else{
                    seqPosition = 0;

                    var audio = new Audio("horn.mp3")
                    audio.play();

                    setTimeout(function () {
                        playSequence();
                        }, 1000);
                }
            }
        }
    });

});