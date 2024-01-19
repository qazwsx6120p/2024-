const Up = "Up";
const Down = "Down";
const Right = "Right";
const Left = "Left";
const canvas = document.querySelector("#myCanvas");

/** canvas 的畫板環境 */
const ctx = canvas.getContext("2d");

/** 遊戲中每小格單位 */
const unit = 20;

/** 共幾列 (橫) */
const row = canvas.height / unit; //320/20=16

/** 共幾行 (直) */
const column = canvas.width / unit; //320/20=16

/** 分數 */
let score = 0;

/** 最高分數 */
let highestScore = 0;

/** array 中每一個元素皆為一個物件，物件的工作室儲存蛇身體的 x,y 座標 */
let snake = [];

/** 當前蛇方向 */
let direction = Right;

/** 果實 class */
class Fruit {
  // 初始化
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  /** 畫出果實 */
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  /** 選定新的果實位置 */
  pickALocation() {
    // 果實是否與蛇身體重疊
    let overlapping = false;
    let newX;
    let newY;

    /** 確認是否有重疊，如果重疊 overlapping = true */
    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX === snake[i].x && newY === snake[i].y) {
          overlapping = true;
          return;
        }
        overlapping = false;
      }
    }
    // 生成一個新位置，並確認是否與蛇身體重疊
    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      checkOverlap(newX, newY);
    } while (overlapping);
    this.x = newX;
    this.y = newY;
  }
}

let fruit = new Fruit();

/** 遊戲初始化函數 */
(function init() {
  loadHighestScore();
  document.querySelector("#myScore").innerHTML = `遊戲分數:${score}`;
  document.querySelector("#myScores").innerHTML = `遊戲分數:${highestScore}`;

  // 設定蛇的初始位置，初始蛇長度共 4，可參考 images/貪食蛇初始位置示意圖，index 0 為頭 ，index 3 為尾
  snake[0] = { x: 80, y: 0 };
  snake[1] = { x: 60, y: 0 };
  snake[2] = { x: 40, y: 0 };
  snake[3] = { x: 20, y: 0 };

  window.addEventListener("keydown", changeDirection);
})();

/** 最高分數初始化，初次進入遊戲，最高分數為0 ; 非初次進入遊戲，最高分數從 localStorage 拿取  */
function loadHighestScore() {
  // 初次進入遊戲
  const isFirstPlay = !localStorage.getItem("highestScore");
  isFirstPlay
    ? (highestScore = 0)
    : (highestScore = Number(localStorage.getItem("highestScore")));
}

/** 設定最高分數，如果當前分數比最高分數高，存至 localStorage */
function setHighestScore() {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

/**
 * 監聽使用者鍵盤事件，更改 direction，且不能 180 度迴轉
 * @e 事件 */
function changeDirection(e) {
  switch (e.code) {
    case `ArrowUp`:
      if (direction !== Down) direction = Up;
      break;
    case `ArrowDown`:
      if (direction !== Up) direction = Down;
      break;
    case `ArrowLeft`:
      if (direction !== Right) direction = Left;
      break;
    case `ArrowRight`:
      if (direction !== Left) direction = Right;
      break;
  }

  // 每次按下上下左右鍵之後，在下一幀被畫出來之前，
  // 不接受任何keydown事件
  // 這樣可以防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

/** 處理貪食蛇主要邏輯 */
function draw() {
  // === 每次畫圖之前確認蛇有沒有咬到自己 ===
  // 從 1 開始跑，0 為頭部一定會重疊
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  // === 每幀重製畫布，不然會重複畫蛇 ===
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fruit.drawFruit();

  // === 畫出蛇的身體 ===
  snake.forEach((body, i) => {
    i === 0 ? (ctx.fillStyle = "lightgreen") : (ctx.fillStyle = "lightblue"); // 填滿的顏色，頭為綠色，其餘藍色
    ctx.strokeStyle = "white"; // 幫身體加白色外框

    // === 檢查是否撞牆 ===
    if (body.x >= canvas.width) snake[i].x = 0;
    if (body.x < 0) snake[i].x = canvas.width - unit;
    if (body.y >= canvas.height) snake[i].y = 0;
    if (body.y < 0) snake[i].y = canvas.height - unit;

    // 繪製"已填滿"的矩形。
    // 參數 == x: 矩形左上角的 x 座標 / y: 矩形左上角的 y 座標 / width: 矩形的寬度 / height: 矩形的高度
    ctx.fillRect(body.x, body.y, unit, unit);
    ctx.strokeRect(body.x, body.y, unit, unit); // 繪製矩形（不填色），幫蛇的身體每一格加一個外框
  });

  // === 以目前 direction 方向，決定蛇的頭下一幀要放在哪一個座標 ===
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // 依照目前方向，每幀計算頭的位置
  switch (direction) {
    case Right:
      snakeX += unit;
      break;
    case Left:
      snakeX -= unit;
      break;
    case Up:
      snakeY -= unit;
      break;
    case Down:
      snakeY += unit;
      break;
  }
  // === 製作新的頭的物件，並更新 snake 陣列內舊的物件，可參考 images/貪食蛇移動1 ===
  const newHead = {
    x: snakeX,
    y: snakeY,
  };

  // === 確認有沒有吃到果實 ===
  // 有吃到果實，不執行 pop ，且增加 newHead，所以會蛇會增長
  const isEatFruit = fruit.x === snakeX && fruit.y === snakeY;
  if (isEatFruit) {
    // 重新選定一個新的隨機位置
    fruit.pickALocation();

    // 畫出果實
    fruit.drawFruit();

    // 更新分數
    score++;
    setHighestScore();
    document.querySelector("#myScore").innerHTML = `遊戲分數:${score}`;
    document.querySelector("#myScores").innerHTML = `最高分數:${highestScore}`;
  }
  // 沒吃到果實，執行 pop 維持長度
  else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

