let deck_id = "";
let valuePlayer = 0;
let amountPlayerAces = 0;
let valueDealer = 0;
let amountDealerAces = 0;
let person = "Player";
let blackjack = 21;
let delay = 800; //ms
let winChanceValue = 0;
let burnChanceValue = 0;
let blackjackChanceValue = 0;
let numbersAfterComma = 2;
let drawChance = 17.6;

const html = document.querySelector('html');

const toggleThemeMode = async function(){
    let string = "";
    if(!html.classList.contains('dark'))  string = "add";
    else string = "remove";
    console.log(string);
    if(string == "add")
    {
        html.classList.add('dark');
    }
    if(string == "remove")
    {
        html.classList.remove('dark');
    }
}


const getCardsPlayer = function(card_id, amount){
    if((valuePlayer < blackjack) & (valueDealer < blackjack))
    {
        handleData(`https://deckofcardsapi.com/api/deck/${card_id}/draw/?count=${amount}`, showCardPlayer);
    }
    else
    {
        startNewGame();
    }
}

const getCardsDealer = function(card_id, amount){
    if(valueDealer < blackjack)
    {
        handleData(`https://deckofcardsapi.com/api/deck/${card_id}/draw/?count=${amount}`, showCardDealer);
    }
}

const getCardsDealerHold = function(card_id, amount){
    if(valueDealer < blackjack)
    {
        handleData(`https://deckofcardsapi.com/api/deck/${card_id}/draw/?count=${amount}`, showCardDealerHold);
    }
}

const createDeck = function(){
    handleData('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6', showDecks);
}

const showCardPlayer = function(data){
    if(data.success == false) {
        alert("No more cards left, creating new game!");
        createDeck();
    }
    array = data.cards
    array.forEach(element => {
        addCardPlayer(element);
    });
    if(valueDealer != blackjack)
    {
        updateCardsLeft(data.remaining);
        if(valuePlayer == blackjack){
            Hold();
        }
        else if (valuePlayer > blackjack){
            if(amountPlayerAces > 0){
                amountPlayerAces--;
                valuePlayer -= 10;
                //recalculate chances
                showChances();
                cardsValuePlayer.innerHTML = `Player: <b>${valuePlayer}</b>`;
            }
            else{
                message.innerHTML = "Burned!";
                btnDrawCard.disabled = true;
                btnHold.disabled = true;
                btnNewGame.classList.remove('u-invisible');
            }
        }
        else{
            message.innerHTML = "Draw a card or hold.";
        }
    }
}

const showCardDealer = function(data){
    //document.querySelector('.js-card').src = data.cards[0].image;
    array = data.cards
    let temp = 1;
    // //adding cards with delay
    // array.forEach(function(element, index){setTimeout(function(){addCardDealer(element)},delay*index);} );
    //adding cards without delay
    array.forEach(element => {
        updateCardsLeft(data.remaining);
        addCardDealer(element);
    });
    if(valueDealer == blackjack){
        message.innerHTML = "You lost, the dealer has blackjack (21)!";
        btnDrawCard.disabled = true;
        btnHold.disabled = true;
        btnNewGame.classList.remove('u-invisible');
    }
    else if (valueDealer > blackjack){
        if(amountDealerAces > 0){
            amountDealerAces--;
            valueDealer -= 10;
            cardsValueDealer.innerHTML = `Dealer: <b>${valueDealer}</b>`;
        }
        else{
            message.innerHTML = "You won, the dealer is burned!";
            btnDrawCard.disabled = true;
            btnNewGame.classList.remove('u-invisible');
        }
    }
}

const showCardDealerHold = function(data){
    array = data.cards
    array.forEach(element => {
        updateCardsLeft(data.remaining);
        addCardDealer(element);
    });
    if(valueDealer == blackjack){
        message.innerHTML = "You lost, the dealer has blackjack (21)!";
        btnDrawCard.disabled = true;
        btnNewGame.classList.remove('u-invisible');
    }
    else if (valueDealer > blackjack){
        if(amountDealerAces > 0){
            amountDealerAces--;
            valueDealer -= 10;
            cardsValueDealer.innerHTML = `Dealer: <b>${valueDealer}</b>`;
            setTimeout(function(){getCardsDealerHold(deck_id, 1)},delay);
        }
        else{
            message.innerHTML = "You won, the dealer is burned!";
            btnDrawCard.disabled = true;
            btnNewGame.classList.remove('u-invisible');
        }
    }
    else if(valueDealer < blackjack){
        if(valueDealer < valuePlayer){
            setTimeout(function(){getCardsDealerHold(deck_id, 1)},delay);
        }
        else if (valueDealer == valuePlayer){
            message.innerHTML = "You lost, the dealer has the same value as you!";
        }
        else{
            message.innerHTML = "You lost, the dealer has a higher value than you!";
            btnDrawCard.disabled = true;
            btnHold.disabled = true;
            btnNewGame.classList.remove('u-invisible');
        }
    }
}

const updateCardsLeft = function(amount){
    cardsLeft.innerHTML = `left: <b>${amount}</b>`;
}

const showDecks = function(data){
    showDeckPlayer(data);
    showDeckDealer(data);
}

const showDeckDealer = function(data){
    amount = 2;
    deck_id = data['deck_id'];
    getCardsDealer(deck_id, amount);
}

const showDeckPlayer = function(data){
    amount = 2;
    deck_id = data['deck_id'];
    getCardsPlayer(deck_id, amount);
}

const addCardPlayer = function(card){
    cardFlipSound.play();
    placeholderCardsPlayer.innerHTML += `<img class="js-play-card c-play-card" src="${card.image}" alt="card">`;
    valuePlayer += getCardValuePlayer(card.value);
    cardsValuePlayer.innerHTML = `Player: <b>${valuePlayer}</b>`;

    showChances();
}

const addCardDealer = function(card){
    cardFlipSound.play();
    placeholderCardsDealer.innerHTML += `<img class="js-play-card c-play-card" src="${card.image}" alt="card">`;
    valueDealer += getCardValueDealer(card.value);
    cardsValueDealer.innerHTML = `Dealer: <b>${valueDealer}</b>`;

    showChances();
}

const getCardValuePlayer = function(valueTag)
{
    value = "0";
    switch(valueTag)
    {
        case '2': value = 2;
        break;
        case '3': value = 3;
        break;
        case '4': value = 4;
        break;
        case '5': value = 5;
        break;
        case '6': value = 6;
        break;
        case '7': value = 7;
        break;
        case '8': value = 8;
        break;
        case '9': value = 9;
        break;
        case '10': value = 10;
        break;
        case 'JACK': value = 10;
        break;
        case 'QUEEN': value = 10;
        break;
        case 'KING': value = 10;
        break;
        case 'ACE': value = 11;
        amountPlayerAces++;
        break;
    }
    return value;
}

const getCardValueDealer = function(valueTag)
{
    value = "0";
    switch(valueTag)
    {
        case '2': value = 2;
        break;
        case '3': value = 3;
        break;
        case '4': value = 4;
        break;
        case '5': value = 5;
        break;
        case '6': value = 6;
        break;
        case '7': value = 7;
        break;
        case '8': value = 8;
        break;
        case '9': value = 9;
        break;
        case '10': value = 10;
        break;
        case 'JACK': value = 10;
        break;
        case 'QUEEN': value = 10;
        break;
        case 'KING': value = 10;
        break;
        case 'ACE': value = 11;
        amountDealerAces++;
        break;
    }
    return value;
}

const listenToClickKnopen = function()
{
  btnDrawCard.addEventListener('click',function()
  {
    console.info('Geklikt');
    getCardsPlayer(deck_id, 1);
  })

  btnNewGame.addEventListener('click',function()
  {
    console.info('Geklikt');
    startNewGame();
  })

  btnToggleMode.addEventListener('click',function()
  {
    console.info('Geklikt');
    toggleThemeMode();
  })
  btnHold.addEventListener('click',function()
  {
        console.info('Geklikt');
        Hold()
  })
  btnDeckOfCards.addEventListener('click',function()
  {
    console.info('Geklikt');
    getCardsPlayer(deck_id, 1);
  })
}

const startNewGame = function(){
    //remove btnNewGame
    btnNewGame.classList.add('u-invisible');
    //Reset values
    valuePlayer = 0;
    valueDealer = 0;
    amountPlayerAces = 0;
    amountDealerAces = 0;
    //Remove existing cards from player
    placeholderCardsPlayer.innerHTML = '<legend>Your cards</legend>';
    //Remove existing cards from dealer
    placeholderCardsDealer.innerHTML = "<legend>Dealer's cards</legend>";
    //enable the draw card button
    btnDrawCard.disabled = false;
    //enable the hold button
    btnHold.disabled = false;
    //Clear the message
    message.innerHTML = '';
    //Start with 2 new cards for the dealer
    getCardsDealer(deck_id, 2);
    //Start with 2 new cards for the player
    getCardsPlayer(deck_id, 2);
}

const Hold = function(){
    //Disable the draw card button
    btnDrawCard.disabled = true;
    //Disable the hold button
    btnHold.disabled = true;
    //Enable the new game button
    btnNewGame.classList.remove('u-invisible');
    //Check who has the highest value
    if(valuePlayer > valueDealer){
        drawUntilWinOrLose();
    }
    else if(valuePlayer < valueDealer){
        message.innerHTML = "you lost, the dealer has a higher value than you!";
    }
    else{
        message.innerHTML = "you lost, the dealer has the same value as you!";
    }
}

const drawUntilWinOrLose = function(){
    getCardsDealerHold(deck_id, 1);
}

const showChances = function(){
    //Check the win chance
    calculateWinChance();

    //Check the burn chance on next hit
    calculateBurnChance();

    //Check blackjack chance on next hit
    calculateBlackjackChance();
}


const calculateWinChance = function(){
    if(valuePlayer < valueDealer)
    {
        if(valueDealer > 21)
        {
            winChanceValue = 100;
        }
        else
        {
            winChanceValue = 0;
        }
    }
    else if(valuePlayer == valueDealer) {winChanceValue = 0;}
    else if(valuePlayer <= 11) {winChanceValue = 0;}
    else if(valueDealer == blackjack) {winChanceValue = 0;}
    else if(valuePlayer == blackjack) {winChanceValue = (100 - drawChance);}
    else if(valuePlayer == (blackjack -1)) {winChanceValue = (((12/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack -2)) {winChanceValue = (((11/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack -3)) {winChanceValue = (((10/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack -4)) {winChanceValue = (((9/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack -5)) {winChanceValue = (((8/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack -6)) {winChanceValue = (((7/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack -7)) {winChanceValue = (((6/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack -8)) {winChanceValue = (((5/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack -9)) {winChanceValue = (((4/13)*100) - drawChance).toFixed(numbersAfterComma);}
    else
    {
        winChanceValue = 0;
    }

    winChance.innerHTML = "<b>" + winChanceValue + "%</b>";
    winChance.style.width = winChanceValue + "%";
}

const calculateBurnChance = function(){
    if(valuePlayer == blackjack) {burnChanceValue = 100;}
    else if(valuePlayer > blackjack) {burnChanceValue = 100;}
    else if(amountPlayerAces > 0) {burnChanceValue = 0;}
    else if(valuePlayer == (blackjack - 1)) {burnChanceValue = ((12/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 2)) {burnChanceValue = ((11/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 3)) {burnChanceValue = ((10/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 4)) {burnChanceValue = ((9/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 5)) {burnChanceValue = ((8/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 6)) {burnChanceValue = ((7/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 7)) {burnChanceValue = ((6/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 8)) {burnChanceValue = ((5/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 9)) {burnChanceValue = ((4/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 10)) {burnChanceValue = 0;}
    else if(valuePlayer == (blackjack - 11)) {burnChanceValue = 0;}
    else if(valuePlayer == (blackjack - 12)) {burnChanceValue = 0}
    else if(valuePlayer < (blackjack - 12)) {burnChanceValue = 0;}
    else
    {
        burnChanceValue = 0;
    }
    burnChance.innerHTML = "<b>" + burnChanceValue + "%</b>";
    burnChance.style.width = burnChanceValue + "%";
}

const calculateBlackjackChance = function(){
    if(valuePlayer == blackjack) {blackjackChanceValue = 100;}
    else if(valuePlayer == (blackjack - 1)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 2)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 3)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 4)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 5)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 6)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 7)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 8)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 9)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);}
    else if(valuePlayer == (blackjack - 10)) {blackjackChanceValue = ((4/13)*100).toFixed(numbersAfterComma);} //K, Q, J
    else if(valuePlayer == (blackjack - 11)) {blackjackChanceValue = ((1/13)*100).toFixed(numbersAfterComma);} //A
    else
    {
        blackjackChanceValue = 0;
    }
    blackjackChance.innerHTML = "<b>" + blackjackChanceValue + "%</b>";
    blackjackChance.style.width = blackjackChanceValue + "%";
}

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
    //Sound
    cardFlipSound = new Audio('sounds/Card-flip.mp3');

    //Buttons
    btnDrawCard = document.querySelector('.js-darw-card');
    btnNewGame = document.querySelector('.js-start-new-game');
    btnHold = document.querySelector('.js-hold');
    btnDeckOfCards = document.querySelector('.js-deck');
    btnToggleMode = document.querySelector('.js-toggle-mode');

    //placeholders
    placeholderCardsPlayer = document.querySelector('.js-player-cards');
    placeholderCardsDealer = document.querySelector('.js-dealer-cards');

    //Values
    cardsValuePlayer = document.querySelector('.js-cards-value-player');
    cardsValueDealer = document.querySelector('.js-cards-value-dealer');
    cardsLeft = document.querySelector('.js-cards-left');

    //Message
    message = document.querySelector('.js-message');
    //Percentages
    winChance = document.querySelector('.js-win-chance');
    //winChance.style.width = "60%";
    burnChance = document.querySelector('.js-burn-chance');
    blackjackChance = document.querySelector('.js-blackjack-chance');

    //Methods
    createDeck();
    listenToClickKnopen();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion