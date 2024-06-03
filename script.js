document.addEventListener('DOMContentLoaded', () => {
  let maxScore =
    localStorage.getItem('maxScore') != null
      ? parseInt(localStorage.getItem('maxScore'))
      : 0;
  const lanes = document.querySelectorAll('.lane');
  const scoreDisplay = document.getElementById('score');
  const bonusScoreDisplay = document.getElementById('bonusScore');
  const music = document.getElementById('music');
  const startButton = document.getElementById('start-button');
  const startContainer = document.getElementById('startContainer');
  const gameContainer = document.getElementById('game-container');
  let maxScoreDisplay = document.getElementById('maxScore');
  let body = document.getElementById('body');

  let maxScoreSaved = document.getElementById('maxScoreSaved');
  if (maxScore > 1) {
    maxScoreSaved.innerText = `اعلى رقم جبته ${maxScore} يمديك تجيب اعلى ؟`;
  }
  if (maxScore > 270) {
    maxScoreSaved.innerText = ` مبرووك قدرت تجيب اعلى من مطور اللعبة نقاطك ${maxScore}`;
  }

  const keys = 'asdf';
  let tringles = [];
  let speed = 4;
  let score = 0;
  let bonusScore = 1;
  let missedScore = 0;
  let spawnInterval = 1000;
  let volume = 0.5;
  let keyState = {};
  const hitboxHeight = 150;
  const maxMisses = 5;

  function startGame() {
    startContainer.style.display = 'none';
    gameContainer.style.display = 'flex';
    scoreDisplay.style.display = 'block';
    bonusScoreDisplay.style.display = 'block';
    maxScoreDisplay.style.display = 'block';
    maxScoreDisplay.innerText = `اعلى رقم : ${maxScore}`;

    music.volume = volume;

    music.play();

    function createtringle() {
      const laneIndex = Math.floor(Math.random() * lanes.length);
      const randomKey = keys[laneIndex];
      const tringle = document.createElement('div');
      tringle.classList.add('note');
      tringle.classList.add('note-key');
      tringle.classList.add(randomKey);
      tringle.textContent = randomKey.toUpperCase();
      lanes[laneIndex].appendChild(tringle);
      tringles.push({ element: tringle, laneIndex, key: randomKey });
    }

    function movetringles() {
      tringles.forEach((tringle) => {
        const top = parseInt(tringle.element.style.top || -50);
        tringle.element.style.top = top + speed + 'px';
        if (top > window.innerHeight - 50) {
          lanes[tringle.laneIndex].removeChild(tringle.element);
          tringles = tringles.filter((n) => n !== tringle);
          decreaseVolume(1);
          missedScore++;

          updateScore();
          const failMessage = document.createElement('div');
          failMessage.textContent = 'انتبه!';
          failMessage.classList.add('messageFail');
          bonusScore = 1;
          bonusScoreDisplay.innerText = `xالبونص : ${bonusScore}`;
          bonusScoreDisplay.style.backgroundColor = '#222';
          bonusScoreDisplay.style.scale = '1';
          bonusScoreDisplay.style.color = 'white';
          gameContainer.appendChild(failMessage);

          setTimeout(() => {
            gameContainer.removeChild(failMessage);
          }, 500);
          checkGameOver();
        }
      });
    }

    function updateScore() {
      scoreDisplay.textContent = `النقاط : ${score} | الاغلاط : ${maxMisses} / ${missedScore} `;
    }

    function decreaseVolume(duration) {
      const originalVolume = music.volume;
      music.volume = 0.1;
      setTimeout(() => {
        music.volume = originalVolume;
      }, duration * 1000);
    }

    function keyDownHandler(e) {
      const keyPressed = e.key.toLowerCase();
      if (keys.includes(keyPressed)) {
        keyState[keyPressed] = true;
        checkHit(keyPressed);
      }
    }

    function checkHit(keyPressed) {
      const laneIndex = keys.indexOf(keyPressed);
      const placeholderBottom = window.innerHeight - 10;
      const placeholderTop = placeholderBottom - hitboxHeight;
      tringles.forEach((tringle, index) => {
        const tringleTop = parseInt(tringle.element.style.top);
        if (
          tringle.key === keyPressed &&
          !tringle.hit &&
          tringleTop >= placeholderTop &&
          tringleTop <= placeholderBottom
        ) {
          lanes[laneIndex].removeChild(tringle.element);
          tringles.splice(index, 1);
          tringle.hit = true;
          tringle.element.classList.add('hit');
          score = 1 * bonusScore + score;
          updateScore();

          const perfectMessage = document.createElement('div');
          perfectMessage.textContent = '! كفوو';
          perfectMessage.classList.add('message');
          gameContainer.appendChild(perfectMessage);

          setTimeout(() => {
            gameContainer.removeChild(perfectMessage);
          }, 500);

          if (score % 10 === 0) {
            speed += 2;
            spawnInterval = Math.max(200, spawnInterval - 100);
            bonusScore++;
            perfectMessage.textContent = `بنرفع الصعوبة شوي`;
            bonusScoreDisplay.innerText = `xالبونص : ${bonusScore} 🔥`;
            bonusScoreDisplay.style.scale = '1.001';
            if (bonusScore == 2) {
              bonusScoreDisplay.style.backgroundColor = 'rgb(249, 233, 47)';
            }
            if (bonusScore == 3) {
              bonusScoreDisplay.style.backgroundColor = 'rgb(249, 200, 47)';
            }
            if (bonusScore >= 4) {
              bonusScoreDisplay.style.backgroundColor = 'rgb(249, 100, 47)';
            }
            bonusScoreDisplay.style.color = '#222';
            perfectMessage.classList.add('message');
            perfectMessage.style.backgroundColor = 'rgba(229, 231, 80, 0.5);';
            gameContainer.appendChild(perfectMessage);

            setTimeout(() => {
              gameContainer.removeChild(perfectMessage);
            }, 1000);
          }
        }
      });
    }

    function checkGameOver() {
      if (missedScore >= maxMisses) {
        endGame();
      }
    }

    async function endGame() {
      if (score > maxScore) {
        maxScore = score;
        localStorage.setItem('maxScore', `${score}`);
      }
      music.pause();
      music.currentTime = 0;

      tringles = [];
      speed = 4;
      score = 0;
      missedScore = 0;
      updateScore();

      gameContainer.style.display = 'none';
      scoreDisplay.style.display = 'none';
      bonusScoreDisplay.style.display = 'none';

      startContainer.style.display = 'block';
      window.location.reload();
    }

    document.addEventListener('keydown', keyDownHandler);

    setInterval(() => {
      movetringles();
    }, 20);

    setInterval(createtringle, spawnInterval);
  }

  startButton.addEventListener('click', startGame);
});
