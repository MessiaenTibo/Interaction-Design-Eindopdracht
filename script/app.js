let deck_id = "";
let value = 0;

const getCards = function(card_id, amount){
    if(value < 21)
    {
        handleData(`https://deckofcardsapi.com/api/deck/${card_id}/draw/?count=${amount}`, showCard);
    }
    else if(value == 21){
        document.querySelector('.js-message').innerHTML = "Proficiat, je hebt blackjack (21)!";
    }
    else{
        document.querySelector('.js-message').innerHTML = "Verbrand!";
        document.querySelector('.js-start-new-game').classList.remove('u-invisible');
    }
}

const showCard = function(data){
    console.log(data);
    console.log(data.cards[0].image);
    //document.querySelector('.js-card').src = data.cards[0].image;
    array = data.cards
    array.forEach(element => {
        addCard(element);
    });
}

const showDeck = function(data){
    console.log(data);
    amount = 2;
    deck_id = data['deck_id'];
    getCards(deck_id, amount);
}

const createDeck = function(){
    handleData('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', showDeck);
}

const addCard = function(card){
    document.querySelector('.js-placeholder-cards').innerHTML += `<img class="js-play-card c-play-card" src="${card.image}" alt="card">`;
    value += getCardValue(card.value);
    document.querySelector('.js-cards-value').innerHTML = `value: ${value}`;
}

const getCardValue = function(valueTag)
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
        break;
    }
    return value;
}

const listenToClickKnopen = function()
{
  document.querySelector('.js-darw-card').addEventListener('click',function()
  {
    console.info('Geklikt');
    getCards(deck_id, 1);
  })

  document.querySelector('.js-start-new-game').addEventListener('click',function()
  {
    console.info('Geklikt');
    document.querySelector('.js-start-new-game').classList.add('u-invisible');
    startNewGame();
  })
}

const startNewGame = function(){
    value = 0;
    document.querySelector('.js-placeholder-cards').innerHTML = '<legend>Deck of cards</legend>';
    getCards(deck_id, 2);
}

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
    createDeck();
    listenToClickKnopen();
};

document.addEventListener('DOMContentLoaded', init);
//#endregion