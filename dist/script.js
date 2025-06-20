document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const giveUpButton = document.getElementById('giveUpButton');
    const restartButton = document.getElementById('restartButton');
    const resultDisplay = document.getElementById('result');
    const answerDisplay = document.getElementById('answer');
    const answerSpan = document.getElementById('answer').querySelector('span');

    let secretNumber = generateSecretNumber();
    let guessCount = 0;
    let guessHistory = []; // 用來儲存猜測歷史

    function generateSecretNumber() {
        const digits = Array.from({ length: 10 }, (_, i) => i);
        shuffleArray(digits);
        return digits.slice(0, 4).map(String);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function checkGuess(guess) {
        let a = 0;
        let b = 0;
        const secret = [...secretNumber];
        const guessed = [...guess];

        for (let i = 0; i < 4; i++) {
            if (guessed[i] === secret[i]) {
                a++;
                secret[i] = '*';
                guessed[i] = '#';
            }
        }

        for (let i = 0; i < 4; i++) {
            if (guessed[i] !== '#') {
                for (let j = 0; j < 4; j++) {
                    if (guessed[i] === secret[j]) {
                        b++;
                        secret[j] = '*';
                        break;
                    }
                }
            }
        }
        return { a, b };
    }

    function updateResultDisplay() {
        resultDisplay.innerHTML = guessHistory.map(item => `<div>第 ${item.count} 次猜測：${item.guess} -> ${item.result}</div>`).join('');
    }

    guessButton.addEventListener('click', () => {
        const guess = guessInput.value;

        if (!/^\d{4}$/.test(guess) || new Set(guess).size !== 4) {
            alert('請輸入四個不重複的數字！');
            return;
        }

        guessCount++;
        const { a, b } = checkGuess(guess);
        const result = `${a}A${b}B`;
        guessHistory.push({ count: guessCount, guess: guess, result: result });
        updateResultDisplay();
        guessInput.value = '';

        if (a === 4) {
            alert(`恭喜你猜對了！答案是 ${secretNumber.join('')}，總共猜了 ${guessCount} 次。`);
            showAnswerAndRestart();
            disableGame();
        }
    });

    giveUpButton.addEventListener('click', () => {
        answerSpan.textContent = secretNumber.join('');
        answerDisplay.style.display = 'block';
        showRestartButton();
        disableGame();
    });

    restartButton.addEventListener('click', () => {
        secretNumber = generateSecretNumber();
        guessCount = 0;
        guessHistory = []; // 清空猜測歷史
        resultDisplay.innerHTML = ''; // 清空結果顯示
        answerDisplay.style.display = 'none';
        restartButton.style.display = 'none';
        guessInput.value = '';
        enableGame();
    });

    function showAnswerAndRestart() {
        answerSpan.textContent = secretNumber.join('');
        answerDisplay.style.display = 'block';
        showRestartButton();
    }

    function showRestartButton() {
        restartButton.style.display = 'inline-block';
    }

    function disableGame() {
        guessInput.disabled = true;
        guessButton.disabled = true;
        giveUpButton.disabled = true;
    }

    function enableGame() {
        guessInput.disabled = false;
        guessButton.disabled = false;
        giveUpButton.disabled = false;
        guessInput.focus();
    }
});