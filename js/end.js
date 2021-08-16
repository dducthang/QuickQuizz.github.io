const end = document.getElementById('end');
const finalScore = document.getElementById('final-score');
const submitUsername = document.getElementById('submit-username');
const username = document.getElementById('username');
const saveBtn = document.getElementById('save-btn');
let highScore =[];

finalScore.innerText=localStorage.getItem('quizScore');

username.addEventListener('keyup', ()=>{
        saveBtn.disabled =!username.value;
})

const saveHighScore=function(event)
{
    const name= username.value;
    const player={
        name:name,
        score:JSON.parse(localStorage.getItem('quizScore'))
    }

    if(!localStorage.getItem('highScore')){
        highScore.push(player);
    }
    else {
        highScore = JSON.parse(localStorage.getItem('highScore'));
        if(highScore.length<10)
            highScore.push(player);
        else if(highScore[0].score>=player.score){
            alert('Beat the top 10 player to be recorded your score!!');
            return;
        }
        else {
            highScore.splice(0, 1);
            highScore.push(player);
        }
            
    }
    highScore.sort((a,b)=>{
        return a.score-b.score;
    });
    localStorage.setItem('highScore',JSON.stringify(highScore));
    return window.location.assign('./index.html');
}