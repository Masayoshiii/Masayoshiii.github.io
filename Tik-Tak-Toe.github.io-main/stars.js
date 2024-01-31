export default class Stars {
    constructor(x, y, size, speed){
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }

    draw(ctx){
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.size, this.size);

        this.y -= this.speed;
    }
}