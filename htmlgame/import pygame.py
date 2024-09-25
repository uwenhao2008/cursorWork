import pygame
import random
import time

# 初始化 Pygame
pygame.init()

# 定义颜色
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)

# 定义游戏区域大小
LENGTH = 80
WIDTH = 65
CELL_SIZE = 10  

# 设置窗口
screen = pygame.display.set_mode((LENGTH * CELL_SIZE, WIDTH * CELL_SIZE))
pygame.display.set_caption("贪吃蛇游戏")

# 蛇类
class Snake:
    def __init__(self, x, y):
        self.body = [(x, y)]
        self.direction = random.choice(["UP", "DOWN", "LEFT", "RIGHT"])
        self.length = 6

    def move(self):
        # 移动逻辑
        head_x, head_y = self.body[0]
        keys = pygame.key.get_pressed()
        
        if keys[pygame.K_W] and self.direction != "DOWN":
            self.direction = "UP"
        elif keys[pygame.K_S] and self.direction != "UP":
            self.direction = "DOWN"
        elif keys[pygame.K_A] and self.direction != "RIGHT":
            self.direction = "LEFT"
        elif keys[pygame.K_D] and self.direction != "LEFT":
            self.direction = "RIGHT"
        
        if self.direction == "UP":
            new_head = (head_x, head_y - 1)
        elif self.direction == "DOWN":
            new_head = (head_x, head_y + 1)
        elif self.direction == "LEFT":
            new_head = (head_x - 1, head_y)
        else:  # RIGHT
            new_head = (head_x + 1, head_y)
        
        self.body.insert(0, new_head)
        if len(self.body) > self.length:
            self.body.pop()
        

    def grow(self):
        self.length += 1

# 食物类
class Food:
    def __init__(self):
        self.position = self.random_position()

    def random_position(self):
        x = random.randint(0, LENGTH - 1)
        y = random.randint(0, WIDTH - 1)
        return (x, y)

# 游戏主循环
def game_loop():
    snake = None  
    food = Food()
    start_time = time.time()

    running = True
    game_started = False

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN and not game_started:
                x, y = event.pos
                snake = Snake(x // CELL_SIZE, y // CELL_SIZE)
                game_started = True

        screen.fill(BLACK)

        # 绘制网格
        for x in range(0, LENGTH * CELL_SIZE, CELL_SIZE):
            pygame.draw.line(screen, WHITE, (x, 0), (x, WIDTH * CELL_SIZE), 1)
        for y in range(0, WIDTH * CELL_SIZE, CELL_SIZE):
            pygame.draw.line(screen, WHITE, (0, y), (LENGTH * CELL_SIZE, y), 1)

        if game_started:
            # 绘制蛇
            for segment in snake.body:
                pygame.draw.rect(screen, WHITE, (segment[0] * CELL_SIZE, segment[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE))

            # 绘制食物
            pygame.draw.rect(screen, RED, (food.position[0] * CELL_SIZE, food.position[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE))

            # 移动蛇
            snake.move()

            # 检查是否吃到食物
            if snake.body[0] == food.position:
                snake.grow()
                food = Food()

            # 每10秒更新食物位置
            if time.time() - start_time > 10:
                food = Food()
                start_time = time.time()

        pygame.display.flip()
        pygame.time.Clock().tick(10)  # 控制游戏速度

    pygame.quit()

if __name__ == "__main__":
    game_loop()
