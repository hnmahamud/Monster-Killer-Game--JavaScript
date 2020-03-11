const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

function getMaxLifeValues() {
    const enteredValue = prompt('Enter maximum life for you and monster.', '100');
    let parsedValue = +enteredValue;
    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw {message: 'Invalid user input.'};
    }
    return parsedValue;
}

let chosenMaxLife;
try {
    chosenMaxLife = getMaxLifeValues();
} catch (err) {
    console.log(err);
    chosenMaxLife = 100;
    alert('You entered something wrong, Default life is 100');
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, playerHealth, monsterHealth) {
    let logEntry;
    if (ev === LOG_EVENT_PLAYER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalPlayerHealth: playerHealth,
            finalMonsterHealth: monsterHealth
        };
    }
    else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalPlayerHealth: playerHealth,
            finalMonsterHealth: monsterHealth
        };
    }
    else if (ev === LOG_EVENT_MONSTER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalPlayerHealth: playerHealth,
            finalMonsterHealth: monsterHealth
        };
    }
    else if (ev === LOG_EVENT_PLAYER_HEAL) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalPlayerHealth: playerHealth,
            finalMonsterHealth: monsterHealth
        };
    }
    else if (ev === LOG_EVENT_GAME_OVER) {
        logEntry = {
            event: ev,
            value: val,
            finalPlayerHealth: playerHealth,
            finalMonsterHealth: monsterHealth
        };
    }
    battleLog.push(logEntry);
}

function reset() {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentPlayerHealth,
        currentMonsterHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(currentPlayerHealth);
        alert('You would be dead but the bonus life saved you!');
    }
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER_WON',
            currentPlayerHealth,
            currentMonsterHealth
        );
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER_WON',
            currentPlayerHealth,
            currentMonsterHealth
        );
    }
    else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A_DRAW',
            currentPlayerHealth,
            currentMonsterHealth
        );
    }

    if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
        alert('Reset Game?');
        reset();
    }
}

function attackMode(mode) {
    let maxDamage;
    let logEvent;
    if (mode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    }
    else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const monsterDamage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= monsterDamage;
    writeToLog(
        logEvent,
        monsterDamage,
        currentPlayerHealth,
        currentMonsterHealth
    );
    endRound();
}

function attackHandler() {
    attackMode(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMode(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert('You can not heal to more than your max initial health!');
        healValue = chosenMaxLife - currentPlayerHealth;
    }
    else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentPlayerHealth,
        currentMonsterHealth
    );
    endRound();
}

function printLog() {
    // for (let k = 0; i < 3; i++) {
    //     console.log('-------------------');
    // }

    // let j = 0;
    // while (j < 3) {
    //     console.log('-------------------');
    //     j++;
    // }

    // let l = 0;
    // do {
    //     console.log('--------------------');
    //     l++;
    // } while (l < 3);

    // for (let i = 0; i < battleLog.length; i++) {
    //     console.log(battleLog[i]);
    // }

    // let i = 0;
    // for (const el of battleLog) {
    //     console.log(i);
    //     console.log(el);
    //     i++
    // }

    let i = 0;
    for (const el of battleLog) {
        console.log(`#${i}`);
        for (const key in el) {
            console.log(key + ' => ' + el[key]);
        }
        i++;
    }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLog);