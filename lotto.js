document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const lottoNumbersContainer = document.getElementById('lotto-numbers');

    if (generateBtn && lottoNumbersContainer) {
        generateBtn.addEventListener('click', () => {
            lottoNumbersContainer.innerHTML = '';
            const numbers = new Set();

            while (numbers.size < 6) {
                const randomNumber = Math.floor(Math.random() * 45) + 1;
                numbers.add(randomNumber);
            }

            const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

            sortedNumbers.forEach((number, index) => {
                const ball = document.createElement('div');
                ball.classList.add('lotto-ball');

                let backgroundColor;
                if (number <= 10) {
                    backgroundColor = 'linear-gradient(145deg, #ffeb3b, #c8b400)'; // Yellow
                } else if (number <= 20) {
                    backgroundColor = 'linear-gradient(145deg, #4caf50, #2e7d32)'; // Green
                } else if (number <= 30) {
                    backgroundColor = 'linear-gradient(145deg, #f44336, #c62828)'; // Red
                } else if (number <= 40) {
                    backgroundColor = 'linear-gradient(145deg, #2196f3, #1565c0)'; // Blue
                } else {
                    backgroundColor = 'linear-gradient(145deg, #9c27b0, #6a1b9a)'; // Purple
                }

                ball.style.background = backgroundColor;
                ball.textContent = number;
                ball.style.animationDelay = `${index * 0.1}s`;
                lottoNumbersContainer.appendChild(ball);
            });
        });
    }
});
