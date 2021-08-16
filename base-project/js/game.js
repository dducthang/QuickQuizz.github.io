const game = document.getElementById('game');
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-prefix'));
const questionCounter=document.getElementById('question-counter');
const gameScore=document.getElementById('score');
const congressBar = document.getElementById('congress-bar-full');
let questions = [
    // {
    //     question:'q1',
    //     choice1:'choice1',
    //     choice2:'choice2',
    //     choice3:'choice3',
    //     choice4:'choice4',
    //     correctChoice:1
    // },
    // {
    //     "category": "Science & Nature",
    //     "type": "multiple",
    //     "difficulty": "medium",
    //     "question": "Along with Oxygen, which element is primarily responsible for the sky appearing blue?",
    //     "correct_answer": "Nitrogen",
    //     "incorrect_answers": [
    //         "Helium",
    //         "Carbon",
    //         "Hydrogen"
    //     ]
    // },
    // {
    //     "category": "Science & Nature",
    //     "type": "multiple",
    //     "difficulty": "medium",
    //     "question": "The moons, Miranda, Ariel, Umbriel, Titania and Oberon orbit which planet?",
    //     "correct_answer": "Uranus",
    //     "incorrect_answers": [
    //         "Jupiter",
    //         "Venus",
    //         "Neptune"
    //     ]
    // },
    // {
    //     "category": "Science & Nature",
    //     "type": "multiple",
    //     "difficulty": "medium",
    //     "question": "Which chemical element has the lowest boiling point?",
    //     "correct_answer": "Helium",
    //     "incorrect_answers": [
    //         "Hydrogen",
    //         "Neon",
    //         "Nitrogen"
    //     ]
    // },
    // {
    //     "category": "Science & Nature",
    //     "type": "multiple",
    //     "difficulty": "medium",
    //     "question": "Which element has the atomic number of 7?",
    //     "correct_answer": "Nitrogen",
    //     "incorrect_answers": [
    //         "Oxygen",
    //         "Hydrogen",
    //         "Neon"
    //     ]
    // },
    // {
    //     "category": "Science & Nature",
    //     "type": "multiple",
    //     "difficulty": "medium",
    //     "question": "Which psychological term refers to the stress of holding contrasting beliefs?",
    //     "correct_answer": "Cognitive Dissonance",
    //     "incorrect_answers": [
    //         "Flip-Flop Syndrome",
    //         "Split-Brain",
    //         "Blind Sight"
    //     ]
    // },
    // {
    //     "category": "Science & Nature",
    //     "type": "multiple",
    //     "difficulty": "medium",
    //     "question": "The &quot;Tibia&quot; is found in which part of the body?",
    //     "correct_answer": "Leg",
    //     "incorrect_answers": [
    //         "Arm",
    //         "Hand",
    //         "Head"
    //     ]
    // },
    // {
    //     "category": "Science & Nature",
    //     "type": "multiple",
    //     "difficulty": "medium",
    //     "question": "Which of these is NOT a part of the structure of a typical neuron?",
    //     "correct_answer": "Islets of Langerhans",
    //     "incorrect_answers": [
    //         "Node of Ranvier",
    //         "Schwann cell",
    //         "Myelin sheath"
    //     ]
    // },
]


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
        //return window.location.assign('./end.html');
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