const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
];
let food = {x: 15, y: 15};
let dx = 1;
let dy = 0;
let gameSpeed = 100; // 初始游戏速度
let gameRunning = true;
let lastTime = 0;
// 等待游戏开始的标志
let waitingForStart = true;

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    console.log('蛇正在移动');  // 添加这行来检查蛇是否在移动
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    gameRunning = false;
    alert("游戏结束！");
}

function resetGame() {
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    food = {x: 15, y: 15};
    dx = 1;
    dy = 0;
    gameSpeed = 100;
    gameRunning = true;
    document.getElementById('speedDisplay').textContent = `当前速度: ${gameSpeed}`;
    drawGame();
}

function restartGame() {
    console.log('重新开始游戏');  // 添加这行来检查函数是否被调用
    if (gameActive) {
        clearInterval(gameInterval);
    }
    
    // 重置游戏状态
    snake = [{ x: 10, y: 10 }];
    food = getRandomFood();
    direction = 'right';
    score = 0;
    
    updateScore();
    startGame();
}

function startGame() {
    // 设置游戏运行状态为真
    gameRunning = true;
    // 初始化上一帧的时间
    lastTime = 0;
    // 请求动画帧，开始游戏循环
    requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
    if (!gameRunning) return;

    if (waitingForStart) {
        // 绘制初始状态，但不移动蛇
        clearCanvas();
        drawSnake();
        drawFood();
        requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = currentTime - lastTime;
    if (deltaTime >= gameSpeed) {
        // 更新游戏状态
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        lastTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}


// 确保在页面加载完成后设置游戏
window.onload = function() {
    startGame();
    console.log('游戏已启动');
};

canvas.addEventListener('mousedown', (e) => {
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const snakeHead = snake[0];
        const centerX = (snakeHead.x + 0.5) * gridSize;
        const centerY = (snakeHead.y + 0.5) * gridSize;
        
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
        
        let newDx = dx;
        let newDy = dy;
        
        if (Math.abs(angle) < Math.PI / 4) {
            newDx = 1;
            newDy = 0;
        } else if (Math.abs(angle) > 3 * Math.PI / 4) {
            newDx = -1;
            newDy = 0;
        } else if (angle > 0) {
            newDx = 0;
            newDy = 1;
        } else {
            newDx = 0;
            newDy = -1;
        }
        
        // 防止蛇直接反向移动
        if (!(newDx === -dx && newDy === -dy)) {
            dx = newDx;
            dy = newDy;
        }
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    
    canvas.addEventListener('mouseup', () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
    }, { once: true });
});

// 添加键盘控制速度
document.addEventListener('keydown', (e) => {
    if (waitingForStart) {
        waitingForStart = false;
    }
    switch(e.key) {
        case 'ArrowUp':
            if (gameSpeed > 50) { // 最小速度限制
                gameSpeed -= 10;
            }
            break;
        case 'ArrowDown':
            if (gameSpeed < 500) { // 最大速度限制
                gameSpeed += 10;
            }
            break;
    }
    document.getElementById('speedDisplay').textContent = `当前速度: ${gameSpeed}`;
});

// 添加速度显示
function addSpeedDisplay() {
    const speedDisplay = document.createElement('div');
    speedDisplay.id = 'speedDisplay';
    speedDisplay.textContent = `当前速度: ${gameSpeed}`;
    document.body.appendChild(speedDisplay);
}

// 在游戏开始前调用此函数
addSpeedDisplay();

// 移除原来的 drawGame() 调用
// drawGame();

