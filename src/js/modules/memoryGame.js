import * as windowManager from './window.js';

export class MemoryGame {
    constructor(size) {
        this.size = size;
        this.cardData = this.randomize();
        this.playerLives = 6
        this.gameElement = null
    }

    randomize() {
        const cardData = this.getData(this.size);
        cardData.sort(() => Math.random() - 0.5);
        return cardData;
    }

    getData() {
        const baseData = [
            { imgSrc: './img/memory_game/0.png', name: '0' },
            { imgSrc: './img/memory_game/1.png', name: '1' },
            { imgSrc: './img/memory_game/2.png', name: '2' },
            { imgSrc: './img/memory_game/3.png', name: '3' },
            { imgSrc: './img/memory_game/4.png', name: '4' },
            { imgSrc: './img/memory_game/5.png', name: '5' },
            { imgSrc: './img/memory_game/6.png', name: '6' },
            { imgSrc: './img/memory_game/7.png', name: '7' },
            { imgSrc: './img/memory_game/0.png', name: '0' },
            { imgSrc: './img/memory_game/1.png', name: '1' },
            { imgSrc: './img/memory_game/2.png', name: '2' },
            { imgSrc: './img/memory_game/3.png', name: '3' },
            { imgSrc: './img/memory_game/4.png', name: '4' },
            { imgSrc: './img/memory_game/5.png', name: '5' },
            { imgSrc: './img/memory_game/6.png', name: '6' },
            { imgSrc: './img/memory_game/7.png', name: '7' },
        ]

        let numOfPairs
        switch (this.size) {
            case '4x4':
                numOfPairs = 8
                break;
            case '2x2':
                numOfPairs = 2
                break;
            case '2x4':
                numOfPairs = 4
                break;

            default:
                throw new Error('invalid size')
        }

        const selectedImages = baseData.slice(0, numOfPairs)
        const cardData = selectedImages.concat(selectedImages)

        return cardData;

    }

    /**
     * create the game window
     * add the cards to the window
     * add event listeners to the cards
     */
    CreateGame() {

        const windowElement = document.createElement('div');
        windowElement.classList.add('window');

        const titleBar = windowManager.makeTitleBar('Memory Game', windowElement);

        const closeButton = document.createElement('button');
        closeButton.classList.add('close_button');
        closeButton.innerHTML = '<img src="img/close2.png" alt="close icon">';

        closeButton.addEventListener('click', () => {
            windowElement.remove();
        });

        titleBar.appendChild(closeButton);
        windowElement.appendChild(titleBar);

        this.gameElement = windowElement;

        const memory_game = document.createElement('div');
        memory_game.classList.add('memory_game');

        // this hedaer has lives and reset button
        const game_header = document.createElement('div');
        game_header.classList.add('game_header');

        const resetButton = document.createElement('button');
        resetButton.classList.add('reset_button');
        resetButton.textContent = 'Reset';

        resetButton.addEventListener('click', () => {
            this.reset('You lost!')
        })

        
        const playerLivesCount = document.createElement('h1');
        playerLivesCount.classList.add('player_lives_count');
        game_header.appendChild(playerLivesCount);
        game_header.appendChild(resetButton);

        const section = document.createElement('section');
        this.section = section

        // determin section layout depending on size
        this.setGridLayout(this.size, section);

        const cardData = this.randomize();

        cardData.forEach((item, index) => {
            const memory_card = document.createElement('div');
            const face = document.createElement('img');
            const back = document.createElement('img');
            memory_card.classList = 'memory_card';
            face.classList = 'face';
            back.classList = 'back';

            // attach the info to the cards
            face.src = item.imgSrc;
            memory_card.setAttribute('name', item.name);

            back.src = './img/memory_game/question_mark.png';
            back.setAttribute('name', 'question_mark');

            memory_card.setAttribute('tabindex', '0');

            // attach the card to the section
            section.appendChild(memory_card)
            memory_card.appendChild(face);
            memory_card.appendChild(back);

            memory_card.addEventListener('click', (e) => {
                memory_card.classList.toggle('togglCard');
                this.checkCards(e, memory_card)
            })

            memory_card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    memory_card.classList.toggle('togglCard');
                    this.checkCards(e, memory_card)
                }
            })

        })

        memory_game.appendChild(game_header);
        memory_game.appendChild(section);
        windowElement.appendChild(memory_game);
        document.querySelector('main').appendChild(windowElement);
        windowManager.makeDraggable(windowElement);

        playerLivesCount.textContent = `Player Lives: ${this.playerLives}`

        this.focusFirstCard();
        this.addKeyboardNavigation();

    }

    /**
     * adjust the grid layout depending on the size
     * @param {*} size 
     * @param {HTMLElement} sectionElement 
     */
    setGridLayout(size, sectionElement) {
        switch (size) {
            case '4x4':
                sectionElement.style.gridTemplateColumns = 'repeat(4, 8rem)';
                sectionElement.style.gridTemplateRows = 'repeat(4, 8rem)';
                break;
            case '2x2':
                sectionElement.style.gridTemplateColumns = 'repeat(2, 8rem)';
                sectionElement.style.gridTemplateRows = 'repeat(2, 8rem)';
                break;
            case '2x4':
                sectionElement.style.gridTemplateColumns = 'repeat(4, 8rem)';
                sectionElement.style.gridTemplateRows = 'repeat(2, 8rem)';
                break;
            default:
                throw new Error('Invalid game size');
        }
    }

    /**
     * check if the cards are the same
     * if they are the same then remove them
     * if they are not the same then flip them back
     * if the player lost then reset the game
     * if the player won then reset the game
     * @param {event} e 
     * @param {HTMLElement} clickedCard 
     * @returns 
     */
    checkCards(e, clickedCard) {
        clickedCard.classList.add('flipped');

        const flippedCards = this.gameElement.querySelectorAll('.flipped');
        const togglCards = this.gameElement.querySelectorAll('.togglCard');

        // logic 
        if (flippedCards.length === 2) {
            if (flippedCards[0].getAttribute('name') === flippedCards[1].getAttribute('name')) {
                flippedCards.forEach((card) => {
                    card.classList.remove('flipped')
                    card.style.pointerEvents = 'none'
                })
            } else {
                flippedCards.forEach((card) => {
                    card.classList.remove('flipped');
                    setTimeout(() => card.classList.remove('togglCard'), 1000)
                })
                this.playerLives--;
                this.gameElement.querySelector('.player_lives_count').textContent = `Player Lives: ${this.playerLives}`;
                if (this.playerLives === 0) {
                    setTimeout(() => this.reset('You lost!'), 1000)
                    return
                }
            }
        }

        // check if won
        setTimeout(() => {
            const totalPairs = this.cardData.length / 2;
            if (togglCards.length === totalPairs * 2) {
                this.reset('You won!')
            }
        }, 1000)
    }

    /**
     * reset the game
     * @param {string} message 
     */
    reset(message) {
        const cardData = this.randomize();
        let faces = this.gameElement.querySelectorAll('.face');
        let cards = this.gameElement.querySelectorAll('.memory_card');
    
        this.section.style.pointerEvents = 'none';
    
        cardData.forEach((item, index) => {
            cards[index].classList.remove('togglCard');
            setTimeout(() => {
                cards[index].style.pointerEvents = 'all';
                faces[index].src = item.imgSrc;
                cards[index].setAttribute('name', item.name);
                this.section.style.pointerEvents = 'all'
            }, 1000)
        })
    
        this.playerLives = 6;
        this.gameElement.querySelector('.player_lives_count').textContent = `Player Lives: ${this.playerLives}`;
        setTimeout(() => window.alert(message), 100)

        this.focusFirstCard();
    }

    focusFirstCard() {
        const firstCard = this.gameElement.querySelector('.memory_card');
        console.log(firstCard)
        if (firstCard) {
            firstCard.focus();
        }
    }


    addKeyboardNavigation() {
        const cards = this.gameElement.querySelectorAll('.memory_card');
        const numCols = this.getNumCols();
    
        cards.forEach((card, index) => {
            card.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowRight':
                        if ((index + 1) % numCols !== 0) { // Prevent moving to next row
                            cards[index + 1]?.focus();
                        }
                        break;
                    case 'ArrowLeft':
                        if (index % numCols !== 0) { // Prevent moving to previous row
                            cards[index - 1]?.focus();
                        }
                        break;
                    case 'ArrowUp':
                        cards[index - numCols]?.focus();
                        break;
                    case 'ArrowDown':
                        cards[index + numCols]?.focus();
                        break;
                }
            });
        });
    }
    
    getNumCols() {
        switch (this.size) {
            case '4x4':
                return 4;
            case '2x2':
                return 2;
            case '2x4':
                return 4;
            default:
                return 4; 
        }
    }


}
