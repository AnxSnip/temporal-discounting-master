import Shape from "./shape.js"

class Circle extends Shape {
    constructor(x, y, minSize, selectable, context) {
        let radius = minSize / 4
        super(x, y, 2 * radius, 2 * radius, selectable, context);
        this.radius = radius
        this.bottom = y + radius;
        this.top = y - radius;
        this.right = x + radius;
        this.left = x - radius;
        this.colorUnlit = "#4169e1"
        this.colorLit = "lightsteelblue"
        this.marginFactor = minSize / 16
        this.colorGrey = "#4169e180"
    }

    draw() {
        if (this.doVibrate) {
            this.vibrate()
        }
        if(this.grey){
            this.colorUnlit = this.colorGrey
        }

        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius + this.marginFactor,
                0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = this.colorLit; //COLOR_SELECT;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.beginPath();
        this.ctx.arc(this.x + this.vibrateX, this.y, this.radius,
            0, Math.PI * 2);
        this.ctx.fill();
    }

    contains(x, y, easyMode=false) {
        if (easyMode){
            return this.left < x && x < this.right && this.top < y && y < this.bottom;
        }
        return Math.abs(x - this.x) < this.radius &&
            Math.abs(this.y - y) < this.radius;
    }

    getShapeName(){
        return "Circle"
    }
}

export default Circle
