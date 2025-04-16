const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
class Entity {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
    resolveCollisionWith(other) {
        const vx = (this.x + this.width / 2) - (other.x + other.width / 2);
        const vy = (this.y + this.height / 2) - (other.y + other.height / 2);

        const combinedHalfWidths = (this.width + other.width) / 2;
        const combinedHalfHeights = (this.height + other.height) / 2;

        if (Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights) {
            const overlapX = combinedHalfWidths - Math.abs(vx);
            const overlapY = combinedHalfHeights - Math.abs(vy);

            if (overlapX < overlapY) {
                // Va chạm theo trục X (trái/phải)
                if (vx > 0) {
                    this.x += overlapX; // chạm từ bên phải obstacle
                } else {
                    this.x -= overlapX; // chạm từ bên trái obstacle
                }
                this.dx = 0;
            } else {
                // Va chạm theo trục Y (trên/dưới)
                if (vy > 0) {
                    this.y += overlapY; // nhảy từ dưới lên
                    this.dy = 0;
                } else {
                    this.y -= overlapY; // rơi từ trên xuống
                    this.dy = 0;
                    this.grounded = true;
                }
            }
        }
    }



}
// Player
class Player extends Entity { // khởi tạo class Player để tạo đối tượng người chơi
    constructor(x, y, width, height, color, dx, dy, speed, jumpForce, gravity, grounded) {
        super(x, y, width, height, color); // gọi hàm khởi tạo của lớp cha

        this.dx = dx;
        this.dy = dy;
        this.speed = speed;
        this.jumpForce = jumpForce;
        this.gravity = gravity;
        this.grounded = grounded;


    }


}

class Obstacle extends Entity { // khởi tạo class Obstacle để tạo đối tượng chướng ngại vật}
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color); // gọi hàm khởi tạo của lớp cha
    }
}
const player = new Player(50, 200, 30, 30, "blue", 0, 0, 5, -15, 0.3, false);

const obstacle = new Obstacle(100, 420, 100, 30, "red");
const obstacle2 = new Obstacle(200, 220, 300, 30, "red");
// const obstacle3 = new Obstacle(300, 220, 30, 30, "red");
class Ground extends Entity { // khởi tạo class Ground để tạo đối tượng mặt đất
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color); // gọi hàm khởi tạo của lớp cha
    }
}
const ground = new Ground(0, 450, 5000, 200, "green"); // tạo đối tượng mặt đất với chiều rộng bằng chiều rộng của canvas và chiều cao là 20px

class Keys { // khởi tạo class keys để tạo đối tượng điều khiển
    constructor(left, right, up) {
        this.left = left; // phím trái
        this.right = right; // phím phải
        this.up = up; // phím lên
    }
}
// Controls
const keys = new Keys(false, false, false); // khởi tạo đối tượng keys với các phím trái, phải và lên đều không được nhấn

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") keys.left = true;
    if (e.code === "ArrowRight") keys.right = true;
    if (e.code === "ArrowUp") keys.up = true;
});

document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") keys.left = false;
    if (e.code === "ArrowRight") keys.right = false;
    if (e.code === "ArrowUp") keys.up = false;
});

function update() {
    // Horizontal movement

    if (keys.left) player.dx = -player.speed;
    else if (keys.right) player.dx = player.speed;
    else player.dx = 0;



    // Jump
    if (keys.up && player.grounded) {
        player.dy = player.jumpForce;
        player.grounded = false;
    }

    // Áp dụng trọng lực
    player.dy += player.gravity;
    // cập nhật vị trí của người chơi
    player.x += player.dx;
    player.y += player.dy;

    // Va chạm với mặt đất
    if (player.y + player.height > ground.y) {
        player.y = ground.y - player.height; // chạm đất: dừng tại mép trên mặt đất
        player.dy = 0;                        // dừng rơi
        player.grounded = true;              // đánh dấu đã chạm đất
    }

}


function gameLoop() {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);// xóa khung vẽ trước đó
    player.resolveCollisionWith(obstacle);
    player.resolveCollisionWith(obstacle2);
    player.draw();
    obstacle.draw();
    obstacle2.draw();
    
    ground.draw();
    requestAnimationFrame(gameLoop);// gọi lại hàm gameLoop để vẽ khung tiếp theo
}

gameLoop();
