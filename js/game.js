const game = document.getElementById('game');
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-prefix'));
const questionCounter=document.getElementById('question-counter');
const gameScore=document.getElementById('score');
const congressBar = document.getElementById('congress-bar-full');
let questions = [];


const LINK = 'https://opentdb.com/api.php?amount=20&category=21&difficulty=medium&type=multiple';
const MAX_QUESTIONS = 12;
const POINT =10;

let counter = 1;
let score =0;
let availableQuestions=[];
let acceptingAnswer =false;

const getRandomInt=(min, max)=>{
    max = Math.floor(max);
    min = Math.ceil(min);
    return Math.floor(Math.random()*(max-min)+min);
}

async function getQuestions(){
    return fetch(LINK)
    .then(response=>{
        if(response.status>=200 && response.status <300)
            return response.json();
        else{
            response.json().then(errData=>{
                console.log(errData);
            })
        }
    })
    .catch(error=>{
        console.log(error);
    });
}

async function startGame(){
    score = 0;
    let response = await getQuestions();
    questions = response.results;
    availableQuestions=[...questions];
    console.log(questions);
    getNewQuestions();
}

const getNewQuestions=()=>{
    if(availableQuestions.length==0||counter> MAX_QUESTIONS){
        localStorage.setItem('quizScore',JSON.stringify(score));
        return window.location.assign('./end.html');
    }
        
    congressBar.style.width= `${(counter/questions.length)*100}%`;
    questionCounter.innerText=`${counter}/${questions.length}`;
    gameScore.innerText=`${score}`;
    console.log('load');

    counter++;
    let iter = getRandomInt(0, availableQuestions.length);

    const questionSet= availableQuestions[iter];
    question.innerText= questionSet['question'];
    const answers =[
        questionSet['correct_answer'],
        questionSet['incorrect_answers'][1], 
        questionSet['incorrect_answers'][2], 
        questionSet['incorrect_answers'][0]
    ];

    choices.forEach(choice=>{
        choice.nextElementSibling.querySelector('.feedback').classList.add('hidden');
        const number = choice.dataset['choice'];

        let answerIndex = getRandomInt(0,answers.length);

        choice.nextElementSibling.querySelector('.answer').innerText= answers[answerIndex];
        choice.nextElementSibling.querySelector('.feedback').classList.remove('fb-correct');
        choice.nextElementSibling.querySelector('.feedback').classList.remove('fb-wrong');
        if(choice.getAttribute('data-correct'))
            delete choice.dataset.correct;

        if(answerIndex==0 ){
            choice.dataset.correct=true;
            choice.nextElementSibling.querySelector('.feedback').classList.add('fb-correct');
            choice.nextElementSibling.querySelector('.feedback').innerHTML=`<i class="far fa-thumbs-up"></i>`;
        }
        else {
            choice.nextElementSibling.querySelector('.feedback').classList.add('fb-wrong');
            choice.nextElementSibling.querySelector('.feedback').innerHTML=`<i class="far fa-times-circle"></i>`
        }
        answers.splice(answerIndex,1);

    })

    availableQuestions.splice(iter, 1);
    acceptingAnswer=true;
}

choices.forEach(choice=>{
    choice.addEventListener('click',()=>{
        if(!acceptingAnswer)return;
        if(choice.dataset['correct']=='true'){
            score+=POINT;
        }
        choice.nextElementSibling.querySelector('.feedback').classList.remove('hidden');
        console.log(score+" - "+availableQuestions.length+" - "+counter);
        
        acceptingAnswer=false;
        setTimeout(() => {
            getNewQuestions();
        }, 1000);
        
    })
})

startGame();