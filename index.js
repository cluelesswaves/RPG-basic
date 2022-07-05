// Data 
const characterData = {
    wizard: {
        name: "Wizard",
        avatar: "images/wizard.png",
        health: 60,
        diceCount: 3,
        currentDiceScore: []
    },
    warrior: {
        name: "Warrior",
        avatar: "https://wiki.guildwars2.com/images/thumb/5/56/Warrior_04_concept_art.png/350px-Warrior_04_concept_art.png",
        health: 90,
        diceCount: 2,
        currentDiceScore: []
    },
    orc: {
        name: "Orc",
        avatar: "images/orc.png",
        health: 30,
        diceCount: 1,
        currentDiceScore: []
    },
    demon: {
        name: "Demon",
        avatar: "images/demon.png",
        health: 25,
        diceCount: 2,
        currentDiceScore: []
    },
    goblin: {
        name: "Goblin",
        avatar: "images/goblin.png",
        health: 20,
        diceCount: 3,
        currentDiceScore: []
    }
}

// Character constructor
class Character {
    constructor(data) {
        Object.assign(this, data)
        this.maxHealth = this.health
        this.diceHtml = getDicePlaceholderHtml(this.diceCount)
    }

    setDiceHtml() {
        this.currentDiceScore = getDiceRollArray(this.diceCount)
        this.diceHtml = this.currentDiceScore.map((num) =>
            `<div class="dice">${num}</div>`).join("")
    }

    takeDamage(attackScoreArray) {
        const totalAttackScore = attackScoreArray.reduce((total, num) => total + num)
        this.health -= totalAttackScore
        if (this.health <= 0) {
            this.dead = true
            this.health = 0
        }
    }

    getHealthBarHtml() {
        const percent = getPercentage(this.health, this.maxHealth)
        return `<div class="health-bar-outer">
                    <div class="health-bar-inner ${percent < 26 ? "danger" : ""}" 
                            style="width:${percent}%;">
                    </div>
                </div>`
    }

    getCharacterHtml() {
        const { elementId, name, avatar, health, diceCount, diceHtml } = this
        const healthBar = this.getHealthBarHtml()
        return `
            <div class="character-card">
                <h4 class="name"> ${name} </h4>
                <img class="avatar" src="${avatar}" />
                <div class="health">health: <b> ${health} </b></div>
                ${healthBar}
                <div class="dice-container">
                    ${diceHtml}
                </div>
            </div>`
    }
}

// Utils
function getDiceRollArray(diceCount) {
    return new Array(diceCount).fill(0).map(() =>
        Math.floor(Math.random() * 6) + 1
    )
}

const getPercentage = (remainingHealth, maximumHealth) => 
    (100 * remainingHealth) / maximumHealth

function getDicePlaceholderHtml(diceCount) {
    return new Array(diceCount).fill(0).map(() =>
        `<div class="placeholder-dice"></div>`
    ).join("")
}

// Main part
let monstersArray = ["orc", "demon", "goblin"]
let isWaiting = false
let heroClass 

function getNewMonster() {
    const nextMonsterData = characterData[monstersArray.shift()]
    return nextMonsterData ? new Character(nextMonsterData) : {}
}

function attack() {
    if(!isWaiting){
        heroClass.setDiceHtml()
        monster.setDiceHtml()
        heroClass.takeDamage(monster.currentDiceScore)
        monster.takeDamage(heroClass.currentDiceScore)
        render()
        
        if(heroClass.dead){
            endGame()
        }
        else if(monster.dead){
            isWaiting = true
            if(monstersArray.length > 0){
                setTimeout(()=>{
                    monster = getNewMonster()
                    render()
                    isWaiting = false
                },1500)
            }
            else{
                endGame()
            }
        }    
    }
}

function endGame() {
    isWaiting = true
    const endMessage = heroClass.health === 0 && monster.health === 0 ?
        "No victors - all creatures are dead" :
        heroClass.health > 0 ? "The Hero Wins" :
            "The monsters are Victorious"

        setTimeout(()=>{
            document.body.innerHTML = `
                <div class="end-game">
                    <h2>Game Over</h2> 
                    <h3>${endMessage}</h3>
                </div>
                `
        }, 1500)
}

document.getElementById("attack-button").addEventListener('click', attack)

function renderWizard() {
    setTimeout(renderHero, 1000)   
    heroClass = wizard  
}

function renderWarrior() {
    setTimeout(renderHero, 1000)  
    heroClass = warrior    
}

function renderHero() {
    document.getElementById('class-choise').style ="display: none"
    document.querySelector('main').style = "display: flex"
    document.querySelector('button').style = "display: inline-block" 
    render()
}

function render() {
    document.getElementById('monster').innerHTML = monster.getCharacterHtml()
    document.getElementById('hero').innerHTML = heroClass.getCharacterHtml()
}

function startingRender() {
    document.getElementById('wizard').innerHTML = wizard.getCharacterHtml()
    document.getElementById('warrior').innerHTML = warrior.getCharacterHtml()
}

const wizard = new Character(characterData.wizard)
const warrior = new Character(characterData.warrior)
let monster = getNewMonster()
startingRender()

document.getElementById("wizard").addEventListener('click', renderWizard);
document.getElementById("warrior").addEventListener('click', renderWarrior);