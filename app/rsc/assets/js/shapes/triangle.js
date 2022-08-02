import Shape from "./shape.js"

class Triangle extends Shape {
    constructor(x, y, minSize, selectable, context) {
        let height = minSize / 2
        super(x,y,height,height,selectable,context);
        this.height = height
        this.bottom = y + this.height / 2;
        this.top = y - this.height / 2;
        this.right = x + this.height / 2;
        this.left = x - this.height / 2;
        this.colorUnlit = "darkorange";
        this.colorLit = "#ffcc66";
        // Top corner
        this.t1 = { x: this.x - this.height / 2, y: this.y + this.height / 2 };
        // Left corner
        this.t2 = { x: this.x, y: this.y - this.height / 2 };
        // Right corner
        this.t3 = { x: this.x + this.height / 2, y: this.y + this.height / 2 };
        this.a_t1_t2 = (this.t1.y - this.t2.y) / (this.t1.x - this.t2.x);
        this.b_t1_t2 = (this.t2.y - this.a_t1_t2 * this.t2.x);
        this.a_t2_t3 = (this.t2.y - this.t3.y) / (this.t2.x - this.t3.x);
        this.b_t2_t3 = (this.t3.y - this.a_t2_t3 * this.t3.x);
        this.marginFactor = minSize / 8
    }

    slope_t1_t2(x) {
        return this.a_t1_t2 * x + this.b_t1_t2;
    }
    slope_t2_t3(x) {
        return this.a_t2_t3 * x + this.b_t2_t3;
    }

    draw() {
        if (this.doVibrate) {
            this.vibrate()
        }
        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit;
            this.ctx.beginPath();
            this.ctx.moveTo(this.t1.x - this.marginFactor,
                this.t1.y + this.marginFactor / 2);
            this.ctx.lineTo(this.t2.x, this.t2.y - this.marginFactor);
            this.ctx.lineTo(this.t3.x + this.marginFactor, this.t3.y + this.marginFactor / 2);
            this.ctx.fill();
            this.ctx.fillStyle = this.colorLit;

        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.t1.x + this.vibrateX, this.t1.y);
        this.ctx.lineTo(this.t2.x + this.vibrateX, this.t2.y);
        this.ctx.lineTo(this.t3.x + this.vibrateX, this.t3.y);
        this.ctx.fill();
    }

    contains(x, y, easyMode=false) {
        if (easyMode) {
            return this.left < x && x < this.right && this.top < y && y < this.bottom;
        }
        return this.t1.x <= x < this.t3.x &&
            y > this.slope_t1_t2(x) &&
            y > this.slope_t2_t3(x) &&
            y <= this.t3.y;
    }

    getShapeName(){
        return "Triangle"
    }
}

export default Triangle
