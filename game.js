// --- ゲーム設定 ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20; // 1マスのサイズ
let tileCountX = canvas.width / gridSize;
let tileCountY = canvas.height / gridSize;

// ヘビの初期設定
let snake = [
    { x: 10, y: 10 } // ヘビの頭
];
// ヘビの進行方向 (x方向, y方向)
let dx = 0;
let dy = 0;

// リンゴの初期設定
let apple = { x: 15, y: 15 };

// スコア
let score = 0;

// ゲームオーバーフラグ
let gameOver = false;

// キー入力の制御フラグ（連続入力を防ぐ）
let changingDirection = false;

// --- ゲームループ ---
function main() {
    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('ゲームオーバー', canvas.width / 4, canvas.height / 2);
        return; // ゲームオーバーならループ停止
    }

    changingDirection = false; // キー入力受付をリセット

    // 0.1秒ごと（100ms）にゲームを更新
    setTimeout(function onTick() {
        clearCanvas();
        drawApple();
        moveSnake();
        drawSnake();
        
        // 再度 main 関数を呼び出してループ
        main();
    }, 100); 
}

// ゲーム開始
main();

// --- キー入力処理 ---
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (changingDirection) return; // 既に入力処理中なら無視
    changingDirection = true;

    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;

    const goingUp = (dy === -1);
    const goingDown = (dy === 1);
    const goingRight = (dx === 1);
    const goingLeft = (dx === -1);

    switch (event.keyCode) {
        case KEY_LEFT:
            if (!goingRight) { dx = -1; dy = 0; } // 右に進んでいなければ左へ
            break;
        case KEY_UP:
            if (!goingDown) { dx = 0; dy = -1; } // 下に進んでいなければ上へ
            break;
        case KEY_RIGHT:
            if (!goingLeft) { dx = 1; dy = 0; } // 左に進んでいなければ右へ
            break;
        case KEY_DOWN:
            if (!goingUp) { dx = 0; dy = 1; } // 上に進んでいなければ下へ
            break;
    }
}

// --- 関数定義 ---

// 画面をクリア
function clearCanvas() {
    ctx.fillStyle = '#333'; // CSSで指定した背景色と同じ
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ヘビを描画
function drawSnake() {
    ctx.fillStyle = 'lime'; // ヘビの色
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// ヘビを移動
function moveSnake() {
    // 新しい頭の位置を計算
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // ヘビの配列の先頭に新しい頭を追加
    snake.unshift(head);

    // 衝突判定
    if (checkCollision(head)) {
        gameOver = true;
        return;
    }

    // リンゴを食べたか判定
    const ateApple = (snake[0].x === apple.x && snake[0].y === apple.y);
    if (ateApple) {
        // スコア加算
        score += 10;
        scoreElement.textContent = score;
        // 新しいリンゴを生成
        generateApple();
    } else {
        // 食べていなければ尻尾を削除
        snake.pop();
    }
}

// 衝突判定（壁または自分自身）
function checkCollision(head) {
    // 壁との衝突
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        return true;
    }
    // 自分自身との衝突（頭を除く）
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// リンゴを描画
function drawApple() {
    ctx.fillStyle = 'red'; // リンゴの色
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

// 新しいリンゴを生成
function generateApple() {
    // ランダムな位置に配置
    apple.x = Math.floor(Math.random() * tileCountX);
    apple.y = Math.floor(Math.random() * tileCountY);

    // ヘビと重なっていたら再生成
    snake.forEach(part => {
        if (part.x === apple.x && part.y === apple.y) {
            generateApple();
        }
    });
}