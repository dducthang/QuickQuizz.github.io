import { Modal } from "../UI/modal.js";

const game = document.getElementById('game');
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-prefix'));
const questionCounter=document.getElementById('question-counter');
const gameScore=document.getElementById('score');
const congressBar = document.getElementById('congress-bar-full');
const home = document.getElementById('home');
const settingSign = document.getElementById('setting-sign');
const settingForm = document.getElementById('setting-form');
const submitSettings = document.getElementById('submit-settings');
const category =document.getElementById('category');
const difficulty =document.getElementById('difficulty');

let questions = [];
let links =[
    {
        number:'21',
        name:'sports'
    },
    {
        number:'17',
        name:'science&nature'
    },
    {
        number:'11',
        name:'films'
    },
    {
        number:'27',
        name:'animals'
    },
    {
        number:'26',
        name:'celebrities'
    },
    {
        number:'19',
        name:'mathematics'
    },

]


let LINK ;
const MAX_QUESTIONS = 12;
const POINT =10;

let counter = 1;
let score =0;
let availableQuestions=[];
let acceptingAnswer =false;

settingSign.addEventListener('click',()=>{
    settingForm.classList.toggle('hidden');
})

submitSettings.addEventListener('click',()=>{
    startGame(category.value, difficulty.value);
})

home.addEventListener('click',()=>{
    // console.log('eiyo');
    return window.location.assign('./');
})

const getRandomInt=(min, max)=>{
    max = Math.floor(max);
    min = Math.ceil(min);
    return Math.floor(Math.random()*(max-min)+min);
}

async function getQuestions(cate, diffi){
    if(cate=='none'||diffi=='none'){
        LINK=`https://opentdb.com/api.php?amount=20&category=21&difficulty=easy&type=multiple`;
    }
    else{
        let numberCate;
        links.forEach(element=>{
            if(element.name==cate){
                numberCate=element.number;
            }
        })
        LINK=`https://opentdb.com/api.php?amount=20&category=${numberCate}&difficulty=${diffi}&type=multiple`;
    }
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

async function startGame(cate, diffi){
    score = 0;
    settingForm.classList.add('hidden');
    const modal = new Modal('loading-modal-content', 'Something wrong happens!!!');
    modal.show();
    let response = await getQuestions(cate, diffi);
    questions = response.results;
    availableQuestions=[...questions];
    console.log(questions);
    modal.hide();
    if(cate=='none'||diffi=='none')
        alert('Quick Quizz starts with default category sports and easy difficulty!!!');
    getNewQuestions();
}

const getNewQuestions=()=>{
    if(availableQuestions.length==0||counter> questions.length){
        localStorage.setItem('quizScore',JSON.stringify(score));
        const modal = new Modal('loading-modal-content','Something wrong happens!!!');
        modal.show();
        setTimeout(() => {
            return window.location.assign('./end.html');
        }, 1000);
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

startGame('none','none');
