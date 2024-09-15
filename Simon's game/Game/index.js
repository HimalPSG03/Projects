var gameArray=[];
var playerArray=[];
var colors=["red","blue","green","yellow"];
var level=0;
var started= false;
$(document).keypress(function(event){
    if(!started){
        if(event.key=="a" || event.key=="A")
    {
        console.log(event.key);
        gameSequence();
        started=true;   
    }
    }
    }   
);
function gameSequence(){
    playerArray=[];
    $("h1").html("Level " + (level+1));
    level++;
    randomNumber = (Math.floor(Math.random()*4));
    console.log(randomNumber);
    randomChosenColor = colors[randomNumber];
    gameArray.push(randomChosenColor);
    $("#"+randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    audioSelector(randomChosenColor);
}

function audioSelector(currentColor)
{
    var audio = new Audio("sounds/"+currentColor+".mp3");
    audio.play();
}
$(".btn").click(function(){
    selectedBtn = $(this).attr("id");
    console.log(selectedBtn);
    playerArray.push(selectedBtn);
    audioSelector(selectedBtn);
    addAnimate(selectedBtn);
    check(playerArray.length-1);
    
});

function addAnimate(currentColor){
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
      $("#" + currentColor).removeClass("pressed");
    }, 100);
  }

function check(currentLevel){ 
    if(playerArray[currentLevel]==gameArray[currentLevel])
    {
        if(playerArray.length==gameArray.length)
        {
            setTimeout(gameSequence,1000);
        }
    }
    else{
        audioSelector("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },500)
        startOver();
    }
}
function startOver(){
    $("h1").html("GAME OVER PRESS A TO RESTART");
    gameArray=[];
    playerArray=[];
    started=false;
    level=0;

}