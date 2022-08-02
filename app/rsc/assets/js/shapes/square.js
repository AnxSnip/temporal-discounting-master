import Shape from "./shape.js"

class Square extends Shape{
    constructor(x, y, minSize, selectable, context) {
        let size = minSize / 2
        super(x, y, size, size, selectable, context);
        this.bottom = y + size / 2;
        this.top = y - size / 2;
        this.right = x + size / 2;
        this.left = x - size / 2;
        this.colorUnlit = "crimson";
        this.colorLit = "lightpink";
        this.marginFactor = minSize / 16
    }

    draw() {
        if (this.doVibrate) {
            this.vibrate()
        }
        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit;
            this.ctx.fillRect(this.left - this.marginFactor,
                this.top - this.marginFactor,
                this.width + this.marginFactor * 2,
                this.height + this.marginFactor * 2);
            this.ctx.fillStyle = this.colorLit;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.fillRect(this.left + this.vibrateX, this.top, this.width, this.height);
    }

    // easyMode parameter for proper code coherence, since the shape
    // is already a square, easyMode would do nothing
    // noinspection JSUnusedLocalSymbols
    contains(x, y, easyMode=false) {
        return this.left < x && x < this.right && this.top < y && y < this.bottom;
    }

    getShapeName(){
        return "Square"
    }
}

export default Square
