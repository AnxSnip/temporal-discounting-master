import Shape from "./shape.js"

class Circle extends Shape {
    constructor(x, y, minSize, selectable, context) {
        super(x, y, minSize/2, minSize/2, selectable, context);
        let size = minSize/2
        this.radius = minSize/4
        this.bottom = y + size/2;
        this.top = y - size/2;
        this.right = x + size/2;
        this.left = x - size/2;
        this.colorUnlit = "#2b8cbe"
        this.colorLit = "lightsteelblue"
        this.marginFactor = minSize / 16
        this.colorGrey = "#2b8cbe80"
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

        super.draw()
    }

    contains(x, y, easyMode=true) {
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
