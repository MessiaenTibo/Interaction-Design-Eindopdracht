let deck_id = "";
let valuePlayer = 0;
let amountPlayerAces = 0;
let valueDealer = 0;
let amountDealerAces = 0;
let person = "Player";
let blackjack = 21;
let delay = 400; //ms
const html = document.querySelector('html');

const toggleThemeMode = async function(){
    let string = "";
    console.log(!html.classList.contains('dark'));
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
    console.log(data);
    console.log(data.cards[0].image);
    //document.querySelector('.js-card').src = data.cards[0].image;
    array = data.cards
    // //adding cards with delay
    // array.forEach(function(element, index){setTimeout(function(){addCardPlayer(element)},delay*(index + 1));} );
    //adding cards without delay
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
                cardsValuePlayer.innerHTML = `Player: <b>${valuePlayer}</b>`;
            }
            else{
                message.innerHTML = "Verbrand!";
                btnDrawCard.disabled = true;
                btnHold.disabled = true;
                btnNewGame.classList.remove('u-invisible');
            }
        }
        else{
            message.innerHTML = "Nog een kaartje?";
        }
    }
}

const showCardDealer = function(data){
    console.log(data);
    console.log(data.cards[0].image);
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
        message.innerHTML = "Je hebt verloren, de dealer heeft blackjack (21)!";
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
            message.innerHTML = "Je hebt gewonnen, de dealer is verbrand!";
            btnDrawCard.disabled = true;
            btnNewGame.classList.remove('u-invisible');
        }
    }
}

const showCardDealerHold = function(data){
    console.log(data);
    console.log(data.cards[0].image);
    array = data.cards
    array.forEach(element => {
        updateCardsLeft(data.remaining);
        addCardDealer(element);
    });
    if(valueDealer == blackjack){
        message.innerHTML = "Je hebt verloren, de dealer heeft blackjack (21)!";
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
            message.innerHTML = "Je hebt gewonnen, de dealer is verbrand!";
            btnDrawCard.disabled = true;
            btnNewGame.classList.remove('u-invisible');
        }
    }
    else if(valueDealer < blackjack){
        if(valueDealer < valuePlayer){
            setTimeout(function(){getCardsDealerHold(deck_id, 1)},delay);
        }
        else{
            message.innerHTML = "Je hebt verloren, de dealer heeft meer punten!";
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
    console.log(data);
    amount = 2;
    deck_id = data['deck_id'];
    getCardsDealer(deck_id, amount);
}

const showDeckPlayer = function(data){
    console.log(data);
    amount = 2;
    deck_id = data['deck_id'];
    getCardsPlayer(deck_id, amount);
}

const addCardPlayer = function(card){
    cardFlipSound.play();
    placeholderCardsPlayer.innerHTML += `<img class="js-play-card c-play-card" src="${card.image}" alt="card">`;
    valuePlayer += getCardValuePlayer(card.value);
    cardsValuePlayer.innerHTML = `Player: <b>${valuePlayer}</b>`;
}

const addCardDealer = function(card){
    cardFlipSound.play();
    placeholderCardsDealer.innerHTML += `<img class="js-play-card c-play-card" src="${card.image}" alt="card">`;
    valueDealer += getCardValueDealer(card.value);
    cardsValueDealer.innerHTML = `Dealer: <b>${valueDealer}</b>`;
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
    btnNewGame.classList.add('u-invisible');
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
        message.innerHTML = "Je hebt verloren!";
    }
    else{
        message.innerHTML = "Je hebt verloren, je hebt evenveel als de dealer!";
    }
}

const drawUntilWinOrLose = function(){
    getCardsDealerHold(deck_id, 1);
}

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
    cardFlipSound = new Audio('sounds/Card-flip.mp3');
    btnDrawCard = document.querySelector('.js-darw-card');
    btnNewGame = document.querySelector('.js-start-new-game');
    btnHold = document.querySelector('.js-hold');
    btnDeckOfCards = document.querySelector('.js-deck');
    placeholderCardsPlayer = document.querySelector('.js-player-cards');
    placeholderCardsDealer = document.querySelector('.js-dealer-cards');
    cardsValuePlayer = document.querySelector('.js-cards-value-player');
    cardsValueDealer = document.querySelector('.js-cards-value-dealer');
    cardsLeft = document.querySelector('.js-cards-left');
    message = document.querySelector('.js-message');
    btnToggleMode = document.querySelector('.js-toggle-mode');

    createDeck();
    listenToClickKnopen();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion