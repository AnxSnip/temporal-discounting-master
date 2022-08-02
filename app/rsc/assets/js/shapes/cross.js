import Shape from "./shape.js"

class Cross extends Shape {
    constructor(x, y, minSize, selectable, context) {
        let size = minSize / 2
        super(x, y, size, size, selectable, context);
        this.thickness = minSize / 8;
        this.bottom = y + size / 2;
        this.top = y - size / 2;
        this.right = x + size / 2;
        this.left = x - size / 2;
        this.rect1x = x - this.thickness / 2;
        this.rect1y = y - size / 2;
        this.rect2x = x - size / 2;
        this.rect2y = y - this.thickness / 2;
        this.colorUnlit = "limegreen";
        this.colorLit = "lightgreen";
        this.marginFactor = minSize / 16
    }

    draw() {
        if (this.doVibrate) {
            this.vibrate()
        }
        if (this.selected || this.unlocked) {
            this.ctx.fillStyle = this.colorUnlit
            this.ctx.fillRect(this.rect1x - this.marginFactor,
                this.rect1y - this.marginFactor,
                this.thickness + this.marginFactor * 2,
                this.height + this.marginFactor * 2);
            this.ctx.fillRect(this.rect2x - this.marginFactor,
                this.rect2y  - this.marginFactor,
                this.width + this.marginFactor * 2,
                this.thickness + this.marginFactor * 2);
            this.ctx.fillStyle = this.colorLit;
        } else if (this.highlight) {
            this.ctx.fillStyle = this.colorLit;
        } else {
            this.ctx.fillStyle = this.colorUnlit;
        }
        this.ctx.fillRect(this.rect1x + this.vibrateX, this.rect1y, this.thickness, this.height);
        this.ctx.fillRect(this.rect2x + this.vibrateX, this.rect2y, this.width, this.thickness);
    }

    contains(x, y, easyMode=false) {
        if (easyMode) {
            return this.left < x && x < this.right && this.top < y && y < this.bottom;
        }
        return this.rect1x < x && x < this.rect1x + this.thickness &&
            this.rect1y < y && y < this.rect1y + this.height ||
            this.rect2x < x && x < this.rect2x + this.width &&
            this.rect2y < y && y < this.rect2y + this.thickness;
    }

    getShapeName(){
        return "Cross"
    }
}

export default Cross
