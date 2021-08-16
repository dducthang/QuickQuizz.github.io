let players = JSON.parse(localStorage.getItem('highScore'));
players.forEach(element => {
    let player = document.createElement('li');
    player.classList.add('player');
    let playerName = document.createElement('div');
    playerName.classList.add('player-name');
    playerName.innerText=element.name;
    let playerScore = document.createElement('div');
    playerScore.classList.add('player-score');
    playerScore.innerText=element.score;
    player.append(playerName, playerScore);
    document.querySelector('.player-list').appendChild(player);
});