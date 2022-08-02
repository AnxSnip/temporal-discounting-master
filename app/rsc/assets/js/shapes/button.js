class Button {
    constructor(x, y, width, height, radius, context) {
        this.w = width;
        this.h = height;
        this.bottom = y + height / 2;
        this.top = y - height / 2;
        this.right = x + width / 2;
        this.left = x - width / 2;
        this.radius = radius;
        this.highlight = false;
        this.ctx = context;
        this.colorUnlit = "white"
        this.colorLit = "gray"
        this.colorStroke = "darkgrey"
    }

    draw() {
        if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colorStroke;
        this.ctx.lineWidth = "4";
        this.ctx.moveTo(this.left + this.radius - 2, this.top);
        this.ctx.lineTo(this.right - this.radius, this.top);
        this.ctx.quadraticCurveTo(this.right, this.top, this.right, this.top + this.radius);
        this.ctx.lineTo(this.right, this.bottom - this.radius);
        this.ctx.quadraticCurveTo(this.right, this.bottom, this.right - this.radius, this.bottom);
        this.ctx.lineTo(this.left + this.radius, this.bottom);
        this.ctx.quadraticCurveTo(this.left, this.bottom, this.left, this.bottom - this.radius);
        this.ctx.lineTo(this.left, this.top + this.radius);
        this.ctx.quadraticCurveTo(this.left, this.top, this.left + this.radius, this.top);
        this.ctx.fill();
        this.ctx.stroke();
    }

    contains(x, y) {
        return x > this.left && x < this.right && y > this.top && y < this.bottom;
    }
}

export default Button